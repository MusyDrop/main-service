import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthTwoFactorGuard } from '../auth/guards/auth-two-factor.guard';
import { Request } from 'express';
import { CreateProjectDto } from './dtos/create-project.dto';
import { CreateProjectResponseDto } from './dtos/response/create-project-response.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AuthTwoFactorGuard)
  @Post('/')
  public async create(
    @Req() req: Request,
    @Body() body: CreateProjectDto
  ): Promise<CreateProjectResponseDto> {
    const project = await this.projectsService.create(req.user.id, body);
    return project.toDto();
  }

  @UseGuards(AuthTwoFactorGuard)
  @Get('/:id(\\d+)')
  public async findAll(@Req() req: Request, @Param() id: number): Promise<any> {
    console.log(id);
  }
}
