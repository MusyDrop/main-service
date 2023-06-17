import { ProjectsController } from './projects.controller';
import { ResponseDtoMapper } from '../common/types';
import { CreateProjectResponseDto } from '../user-projects/dtos/response/create-project-response.dto';
import { GetProjectResponseDto } from '../user-projects/dtos/response/get-project-response.dto';
import { GetProjectsResponseDto } from '../user-projects/dtos/response/get-projects-response.dto';
import { Project } from './entities/project.entity';
import { UpdateProjectResponseDto } from '../user-projects/dtos/response/update-project-response.dto';
import { UploadAudioFileResponseDto } from '../user-projects/dtos/response/upload-audio-file-response.dto';
import { ProjectDto } from './dtos/project.dto';
import { Injectable } from '@nestjs/common';

// NOTE: CRD - ControllerResponseDto
@Injectable()
export class ProjectsCrdMapper
  implements ResponseDtoMapper<ProjectsController>
{
  public createMapper(project: Project): CreateProjectResponseDto {
    return {
      project: Project.toDto(project) as ProjectDto
    };
  }

  public findAllMapper(projects: Project[]): GetProjectsResponseDto {
    return {
      projects: projects.map((p) => Project.toDto(p) as ProjectDto)
    };
  }

  public findOneMapper(project: Project): GetProjectResponseDto {
    return {
      project: Project.toDto(project) as ProjectDto
    };
  }

  public updateMapper(project: Project): UpdateProjectResponseDto {
    return {
      project: Project.toDto(project) as ProjectDto
    };
  }

  public uploadAudioMapper(audioFileName: string): UploadAudioFileResponseDto {
    return {
      fileName: audioFileName
    };
  }
}
