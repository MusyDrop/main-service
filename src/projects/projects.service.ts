import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dtos/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    protected readonly projectsRepository: Repository<Project>
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

  public async update(
    userId: number,
    props: DeepPartial<Project>
  ): Promise<Project> {
    return await this.projectsRepository.save({
      ...props,
      user: { id: userId }
    });
  }
}
