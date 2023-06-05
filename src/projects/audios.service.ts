import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Audio } from './entities/audio.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AudiosService {
  constructor(
    @InjectRepository(Audio)
    private readonly audiosRepository: Repository<Audio>
  ) {}

  public async findOneNullable(
    props: DeepPartial<Audio>
  ): Promise<Audio | null> {
    return await this.audiosRepository.findOneBy({
      id: props.id,
      guid: props.guid,
      audioFileName: props.audioFileName
    });
  }

  public async findOne(props: DeepPartial<Audio>): Promise<Audio> {
    const audio = await this.findOneNullable(props);

    if (!audio) {
      throw new NotFoundException('Audio not found');
    }

    return audio;
  }

  public async create(props: DeepPartial<Audio>): Promise<Audio> {
    const existingAudio = await this.findOneNullable({
      audioFileName: props.audioFileName
    });

    if (existingAudio) {
      throw new UnprocessableEntityException(
        'Audio with such name already exists'
      );
    }

    return await this.audiosRepository.save({
      audioFileName: props.audioFileName,
      durationSecs: props.durationSecs,
      bitsPerSample: props.bitsPerSample,
      numberOfChannels: props.numberOfSamples,
      bitrate: props.bitrate,
      lossless: props.lossless,
      numberOfSamples: props.numberOfSamples,
      codec: props.codec,
      container: props.container,
      compressedRms: props.compressedRms
    });
  }
}
