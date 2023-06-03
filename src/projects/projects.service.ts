import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dtos/create-project.dto';
import { generateUniqueId } from '../utils/unique-id-generator';
import { S3Service } from '../s3/s3.service';
import { ExtendedConfigService } from '../config/extended-config.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    private readonly s3Service: S3Service,
    private readonly config: ExtendedConfigService
  ) {}

  public async create(
    userId: number,
    props: CreateProjectDto
  ): Promise<Project> {
    const existingProject = await this.findOneNullable({
      user: { id: userId },
      name: props.name
    });

    if (existingProject) {
      throw new UnprocessableEntityException(
        'Project with such already exists'
      );
    }

    return await this.projectsRepository.save({
      name: props.name,
      templateId: props.templateId,
      user: { id: userId }
    });
  }

  public async findOneNullable(
    props: DeepPartial<Project>
  ): Promise<Project | null> {
    return await this.projectsRepository.findOneBy({
      id: props.id,
      guid: props.guid,
      name: props.name,
      templateId: props.templateId
    });
  }

  public async findOne(props: DeepPartial<Project>): Promise<Project> {
    const project = await this.findOneNullable(props);

    if (!project) {
      throw new NotFoundException('Project has not been found');
    }

    return project;
  }

  public async findAllByUserId(userId: number): Promise<Project[]> {
    return await this.projectsRepository.findBy({
      user: { id: userId }
    });
  }

  public async updateByUserId(
    userId: number,
    props: DeepPartial<Project>
  ): Promise<Project> {
    return await this.projectsRepository.save({
      ...props,
      user: { id: userId }
    });
  }

  public async update(props: DeepPartial<Project>): Promise<Project> {
    return await this.projectsRepository.save({
      id: props.id,
      guid: props.guid,
      name: props.name,
      templateId: props.templateId,
      audioFileName: props.audioFileName
    });
  }

  /**
   * @returns generated audio file name
   * @param guid
   * @param audioFile
   */
  public async uploadAudioFile(
    guid: string,
    audioFile: Buffer
  ): Promise<string> {
    const audioFileName = await this.s3Service.putObject(
      this.config.get('minio.buckets.audioFilesBucket'),
      audioFile
    );

    const project = await this.findOne({ guid });

    await this.update({
      id: project.id,
      audioFileName
    });

    return audioFileName;
  }
}
