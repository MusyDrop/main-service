import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthTwoFactorGuard } from '../auth/guards/auth-two-factor.guard';
import { Request } from 'express';
import { CreateProjectDto } from '../user-projects/dtos/create-project.dto';
import { CreateProjectResponseDto } from '../user-projects/dtos/response/create-project-response.dto';
import { GetProjectResponseDto } from '../user-projects/dtos/response/get-project-response.dto';
import { GetProjectsResponseDto } from '../user-projects/dtos/response/get-projects-response.dto';
import { UpdateProjectResponseDto } from '../user-projects/dtos/response/update-project-response.dto';
import { UpdateProjectDto } from '../user-projects/dtos/update-project.dto';
import { ProjectsCrdMapper } from './projects-crd.mapper';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileRequiredPipe } from '../common/pipes/file-required.pipe';
import { UploadAudioFileResponseDto } from '../user-projects/dtos/response/upload-audio-file-response.dto';
import { AnalyzerApiClient } from '../audio-meta/analyzer.api-client';

@Controller('/projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    public readonly responseDtoMapper: ProjectsCrdMapper
  ) {}
}
