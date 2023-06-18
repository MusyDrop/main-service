import {
  Body,
  Controller,
  Delete,
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
import { ValidateUuidPipe } from '../common/pipes/validate-uuid.pipe';
import { AuthTwoFactorGuard } from '../auth/guards/auth-two-factor.guard';
import { Request, Express } from 'express';
import { GetProjectsResponseDto } from './dtos/response/get-projects-response.dto';
import { ProjectsService } from '../projects/projects.service';
import { UserProjectsCrdMapper } from './mappers/user-projects-crd.mapper';
import { GetProjectResponseDto } from './dtos/response/get-project-response.dto';
import { CreateProjectDto } from './dtos/create-project.dto';
import { CreateProjectResponseDto } from './dtos/response/create-project-response.dto';
import { DeleteProjectResponseDto } from './dtos/response/delete-project-response.dto';
import { UpdateProjectResponseDto } from './dtos/response/update-project-response.dto';
import { UploadAudioFileResponseDto } from './dtos/response/upload-audio-file-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileRequiredPipe } from '../common/pipes/file-required.pipe';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { RenderJobResponseDto } from '../render-service/dtos/response/render-job-response.dto';

@UseGuards(AuthTwoFactorGuard)
@Controller('/users/me/projects')
export class UserProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly responseMapper: UserProjectsCrdMapper
  ) {}

  @Get('/')
  public async findAll(@Req() req: Request): Promise<GetProjectsResponseDto> {
    const projects = await this.projectsService.findAllByUserIdWithAudio(
      req.user.id
    );
    return this.responseMapper.findAllMapper(projects);
  }

  @Get('/:guid')
  public async findOne(
    @Param('guid', new ValidateUuidPipe()) guid: string,
    @Req() req: Request
  ): Promise<GetProjectResponseDto> {
    const project = await this.projectsService.findOneWithAudio({
      guid,
      user: { id: req.user.id }
    });
    return this.responseMapper.findOneMapper(project);
  }

  @Post('/')
  public async create(
    @Param('guid', new ValidateUuidPipe()) guid: string,
    @Req() req: Request,
    @Body() body: CreateProjectDto
  ): Promise<CreateProjectResponseDto> {
    const project = await this.projectsService.create(
      req.user.id,
      body,
      req.accessToken as string
    );
    return this.responseMapper.createMapper(project);
  }

  @Put('/:guid')
  public async update(
    @Param('guid', new ValidateUuidPipe()) guid: string,
    @Req() req: Request,
    @Body() body: UpdateProjectDto
  ): Promise<UpdateProjectResponseDto> {
    const project = await this.projectsService.updateByUserId(req.user.id, {
      templateGuid: body.templateGuid,
      name: body.name,
      settings: body.settings
    });
    return this.responseMapper.updateMapper(project);
  }

  @Delete('/:guid')
  public async delete(
    @Param('guid', new ValidateUuidPipe()) guid: string,
    @Req() req: Request
  ): Promise<DeleteProjectResponseDto> {
    await this.projectsService.deleteByGuid(req.user.id, guid);
    return this.responseMapper.deleteMapper();
  }

  @UseInterceptors(FileInterceptor('audio'))
  @Post('/:guid')
  public async uploadAudio(
    @Param('guid', new ValidateUuidPipe()) guid: string,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileRequiredPipe({}),
          new FileTypeValidator({ fileType: 'audio/wav' })
        ]
      })
    )
    audio: Express.Multer.File // TODO: Buffer stays in memory, use stream instead
  ): Promise<UploadAudioFileResponseDto> {
    const audioFileName = await this.projectsService.uploadAudioFile(
      req.user.id,
      guid,
      audio.buffer
    );
    return this.responseMapper.uploadAudioMapper(audioFileName);
  }

  @Post('/:guid/render')
  public async render(
    @Param('guid', new ValidateUuidPipe()) guid: string,
    @Req() req: Request
  ): Promise<RenderJobResponseDto> {
    const renderDto = await this.projectsService.render(
      req.user.id,
      guid,
      req.accessToken as string
    );
    return this.responseMapper.renderMapper(renderDto);
  }
}
