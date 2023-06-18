import { Injectable } from '@nestjs/common';
import { ResponseDtoMapper } from '../../common/types';
import { UserProjectsController } from '../user-projects.controller';
import { Project } from '../../projects/entities/project.entity';
import { CreateProjectResponseDto } from '../dtos/response/create-project-response.dto';
import { ProjectDto } from '../../projects/dtos/project.dto';
import { GetProjectsResponseDto } from '../dtos/response/get-projects-response.dto';
import { GetProjectResponseDto } from '../dtos/response/get-project-response.dto';
import { UpdateProjectResponseDto } from '../dtos/response/update-project-response.dto';
import { UploadAudioFileResponseDto } from '../dtos/response/upload-audio-file-response.dto';
import { DeleteProjectResponseDto } from '../dtos/response/delete-project-response.dto';
import { RenderJobResponseDto } from '../../render-service/dtos/response/render-job-response.dto';

@Injectable()
export class UserProjectsCrdMapper
  implements ResponseDtoMapper<UserProjectsController>
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

  public deleteMapper(): DeleteProjectResponseDto {
    return {};
  }

  public renderMapper(dto: RenderJobResponseDto): RenderJobResponseDto {
    return dto;
  }
}
