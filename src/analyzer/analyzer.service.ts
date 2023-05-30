import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { BullQueue } from '../bull/bull-queue.enum';
import { Queue } from 'bull';
import { AudioMetadataDetectionJobPayload } from './interfaces/audio-metadata-detection-job-payload.interface';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AnalyzerService {
  constructor(
    @InjectQueue(BullQueue.AUDIO_METADATA_DETECTION)
    private readonly audioMetadataDetection: Queue<AudioMetadataDetectionJobPayload>,
    @InjectPinoLogger(AnalyzerService.name) private readonly logger: PinoLogger
  ) {}

  /**
   * Accepts an audio file name from S3 bucket
   * @param audioFileName
   */
  public async getAudioMetadata(audioFileName: string): Promise<string> {
    const job = await this.audioMetadataDetection.add({ audioFileName });

    try {
      return await job.finished();
    } catch (e) {
      this.logger.error(`Unable to analyze provided audio file, error: ${e}`);
      throw new BadRequestException('Unable to analyze provided audio file');
    }
  }
}
