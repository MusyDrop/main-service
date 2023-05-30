import { Process, Processor } from '@nestjs/bull';
import { BullQueue } from '../bull/bull-queue.enum';
import { Job } from 'bull';
import { AudioMetadataDetectionJobPayload } from './interfaces/audio-metadata-detection-job-payload.interface';
import { S3Service } from '../s3/s3.service';
import { ExtendedConfigService } from '../config/extended-config.service';
import { IAudioMetadata, parseBuffer } from 'music-metadata';
import { GetAudioMetadataResponseDto } from './dtos/get-audio-metadata-response.dto';
import { streamToBuffer } from '../utils/other-utils';
import { AudioMetadataDto } from './dtos/audio-metadata.dto';

@Processor(BullQueue.AUDIO_METADATA_DETECTION)
export class AudioMetadataQueueProcessor {
  private readonly RAW_DATA_CHUNK_BYTES_OFFSET = 44;

  constructor(
    private readonly s3Service: S3Service,
    private readonly config: ExtendedConfigService
  ) {}

  @Process({ concurrency: 1 })
  public async execute(
    job: Job<AudioMetadataDetectionJobPayload>
  ): Promise<GetAudioMetadataResponseDto> {
    const stream = await this.s3Service.getObject(
      this.config.get('minio.buckets.audioFilesBucket'),
      job.data.audioFileName
    );

    const buffer = await streamToBuffer(stream);

    const parsedMetadata = await parseBuffer(buffer);
    const metadata = this.stripFormatAndCheck(parsedMetadata);

    const rms = this.calculateRms(buffer, metadata);

    // E.g. 167 seconds consist of 5015 keyframes and in order to position keyframes relatively to time
    // we have to increment seconds counter by the duration/keyframesNumber
    const secondsIncrement = metadata.durationSecs / rms.length;
    const offset = secondsIncrement * 0.01; // slight offset shift
    // Seconds fractions or times at which we set the keyframes (rms values)
    let timeCounter = 0;
    const timestamps = rms.map(() => {
      const time = timeCounter;
      timeCounter += secondsIncrement - offset;
      return time;
    });

    return {
      ...metadata,
      rms,
      timestamps
    };
  }

  private stripFormatAndCheck(metadata: IAudioMetadata): AudioMetadataDto {
    const format = metadata.format;

    const formattedMetadata: AudioMetadataDto = {
      durationSecs: format.duration,
      bitsPerSample: format.bitsPerSample,
      sampleRate: format.sampleRate,
      numberOfChannels: format.numberOfChannels,
      bitrate: format.bitrate,
      lossless: format.lossless,
      numberOfSamples: format.numberOfSamples,
      codec: format.codec,
      container: format.container
    };

    for (const value of Object.values(formattedMetadata)) {
      if (value === undefined) {
        throw Error('Unable to identify format of an audio file');
      }
    }

    return formattedMetadata;
  }

  /**
   * Calculates RMS by the specified frequency
   * @param buffer
   * @param metadata
   * @param aggregationFrequency
   */
  private calculateRms(
    buffer: Buffer,
    metadata: AudioMetadataDto,
    aggregationFrequency = 30
  ): number[] {
    const rawPcmChunk = buffer.slice(this.RAW_DATA_CHUNK_BYTES_OFFSET);
    const view = Buffer.from(rawPcmChunk);
    // const samples = view.byteLength / meta.format.numberOfChannels / (meta.format.bitsPerSample / 8);

    const RmsPerAggregation: number[] = [];
    const audioSamplesPerVideoFrame =
      metadata.sampleRate / aggregationFrequency;
    let squaredSampleValuesSum = 0;

    for (
      let sampleIndex = 0;
      sampleIndex < metadata.numberOfSamples;
      sampleIndex++
    ) {
      let monoValue = 0;

      for (
        let channelIndex = 0;
        channelIndex < metadata.numberOfChannels;
        channelIndex++
      ) {
        // 3 bytes are derived from bits per sample (24 bits === 3 bytes, 16 bits === 2 bytes)

        // It must be >= 0 and <= 1975025
        const bytesOffset =
          (sampleIndex * metadata.numberOfChannels + channelIndex) * 3;

        // Notice: divided by 2 in order to convert it to mono
        monoValue += view.readIntLE(bytesOffset, 3) / 2;
        squaredSampleValuesSum += Math.pow(monoValue, 2);
      }

      // Reset frame counter and save RMS each audioSamplesPerVideoFrame sample
      if (sampleIndex % audioSamplesPerVideoFrame === 0) {
        const RMS = Math.sqrt(
          squaredSampleValuesSum / audioSamplesPerVideoFrame
        );
        RmsPerAggregation.push(RMS);
        squaredSampleValuesSum = 0;
      }
    }

    return this.normaliseRms(RmsPerAggregation);
  }

  /**
   * Normalises RMS values in the range suitable for keyframes
   * @param RmsValues array of integers
   */
  private normaliseRms(RmsValues: number[]): number[] {
    const max = Math.max(...RmsValues);
    const min = Math.min(...RmsValues);

    // 100 is a multiplier to move from 0-1 to 0-100
    return RmsValues.map((value) => ((value - min) / (max - min)) * 100);
  }
}
