import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthTwoFactorGuard } from '../auth/guards/auth-two-factor.guard';
import { Request } from 'express';
import { CreateProjectDto } from './dtos/create-project.dto';
import { CreateProjectResponseDto } from './dtos/response/create-project-response.dto';
import { GetProjectResponseDto } from './dtos/response/get-project-response.dto';
import { GetProjectsResponseDto } from './dtos/response/get-projects-response.dto';
import { UpdateProjectResponseDto } from './dtos/response/update-project-response.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { ProjectsCrdMapper } from './projects-crd.mapper';

@Controller('/projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    public readonly responseDtoMapper: ProjectsCrdMapper
  ) {}

  @UseGuards(AuthTwoFactorGuard)
  @Post('/')
  public async create(
    @Req() req: Request,
    @Body() body: CreateProjectDto
  ): Promise<CreateProjectResponseDto> {
    const project = await this.projectsService.create(req.user.id, body);
    return this.responseDtoMapper.createMapper(project);
  }

  @UseGuards(AuthTwoFactorGuard)
  @Get('/')
  public async findAll(@Req() req: Request): Promise<GetProjectsResponseDto> {
    const projects = await this.projectsService.findAllByUserId(req.user.id);
    return this.responseDtoMapper.findAllMapper(projects);
  }

  @UseGuards(AuthTwoFactorGuard)
  @Get('/:guid')
  public async findOne(
    @Req() req: Request,
    @Param('guid') guid: string
  ): Promise<GetProjectResponseDto> {
    const project = await this.projectsService.findOne({ guid });
    return this.responseDtoMapper.findOneMapper(project);
  }

  @UseGuards(AuthTwoFactorGuard)
  @Put('/:guid')
  public async update(
    @Req() req: Request,
    @Param('guid') guid: string,
    @Body() body: UpdateProjectDto
  ): Promise<UpdateProjectResponseDto> {
    const project = await this.projectsService.update(req.user.id, {});
    return this.responseDtoMapper.updateMapper(project);
  }
}
