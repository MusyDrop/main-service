import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from '../user-projects/dtos/create-project.dto';
import { generateUniqueId } from '../utils/unique-id-generator';
import { S3Service } from '../s3/s3.service';
import { ExtendedConfigService } from '../config/extended-config.service';
import { AudiosService } from './audios.service';
import { AnalyzerApiClient } from '../audio-meta/analyzer.api-client';
import { RenderServiceApiClient } from '../render-service/render-service.api-client';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    private readonly s3Service: S3Service,
    private readonly config: ExtendedConfigService,
    private readonly audiosService: AudiosService,
    private readonly analyzerApiClient: AnalyzerApiClient,
    private readonly renderServiceApiClient: RenderServiceApiClient
  ) {}

  public async create(
    userId: number,
    props: CreateProjectDto,
    accessToken: string
  ): Promise<Project> {
    const existingProject = await this.findOneNullableWithAudio({
      user: { id: userId },
      name: props.name
    });

    if (existingProject) {
      throw new UnprocessableEntityException(
        'Project with such already exists'
      );
    }

    const template = await this.renderServiceApiClient.findTemplateByGuid(
      props.templateGuid,
      accessToken
    );

    return await this.projectsRepository.save({
      name: props.name,
      templateGuid: template.template.guid,
      user: { id: userId }
    });
  }

  public async findOneNullableWithAudio(
    props: DeepPartial<Project>
  ): Promise<Project | null> {
    return await this.projectsRepository.findOne({
      relations: {
        audio: true
      },
      where: {
        id: props.id,
        guid: props.guid,
        name: props.name,
        templateGuid: props.templateGuid,
        user: { id: props.user?.id }
      }
    });
  }

  public async findOneWithAudio(props: DeepPartial<Project>): Promise<Project> {
    const project = await this.findOneNullableWithAudio(props);

    if (!project) {
      throw new NotFoundException('Project has not been found');
    }

    return project;
  }

  public async findAllByUserIdWithAudio(userId: number): Promise<Project[]> {
    return await this.projectsRepository.find({
      relations: {
        audio: true
      },
      where: {
        user: { id: userId }
      }
    });
  }

  public async updateByUserId(
    userId: number,
    guid: string,
    props: DeepPartial<Project>
  ): Promise<Project> {
    await this.projectsRepository.update(
      {
        guid,
        user: { id: userId }
      },
      {
        name: props.name,
        templateGuid: props.templateGuid,
        settings: props.settings
      }
    );

    return await this.findOneWithAudio({ guid });
  }

  public async update(props: DeepPartial<Project>): Promise<Project> {
    const project = await this.projectsRepository.save({
      id: props.id,
      guid: props.guid,
      name: props.name,
      templateGuid: props.templateGuid,
      audio: props.audio,
      user: props.user
    });

    return await this.findOneWithAudio({ id: project.id });
  }

  /**
   * @returns Generated audio file name
   * @param userId
   * @param guid
   * @param audioFile
   */
  public async uploadAudioFile(
    userId: number,
    guid: string,
    audioFile: Buffer
  ): Promise<string> {
    const project = await this.findOneWithAudio({ guid, user: { id: userId } });

    const audioFileName = await this.s3Service.putObject(
      this.config.get('minio.buckets.audioFilesBucket'),
      audioFile
    );

    const metadata = await this.analyzerApiClient.getAudioMetadata(
      audioFileName
    );

    const audio = await this.audiosService.create({
      audioFileName,
      durationSecs: metadata.durationSecs,
      bitsPerSample: metadata.bitsPerSample,
      numberOfChannels: metadata.numberOfSamples,
      bitrate: metadata.bitrate,
      lossless: metadata.lossless,
      numberOfSamples: metadata.numberOfSamples,
      codec: metadata.codec,
      container: metadata.container,
      compressedRms: metadata.compressedRms
    });

    await this.update({
      id: project.id,
      audio: { id: audio.id }
    });

    return audioFileName;
  }

  public async deleteByGuid(userId: number, guid: string): Promise<void> {
    await this.projectsRepository.softDelete({ guid, user: { id: userId } });
  }

  public async render(
    userId: number,
    guid: string,
    accessToken: string
  ): Promise<any> {
    const project = await this.findOneWithAudio({ user: { id: userId }, guid });

    if (!project.audio) {
      throw new UnprocessableEntityException(
        'Please upload audio file before rendering'
      );
    }
    const renderDto = await this.renderServiceApiClient.render(
      {
        templateGuid: project.templateGuid,
        audioFileName: project.audio.audioFileName,
        projectGuid: project.guid,
        settings: project.settings,
        compressedRms: Array.from(project.audio.compressedRms),
        audioDurationSecs: parseFloat(project.audio.durationSecs.toFixed(2))
      },
      accessToken
    );

    return renderDto;
  }
}
