import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { AuthModule } from '../auth/auth.module';
import { ProjectsCrdMapper } from './projects-crd.mapper';
import { S3Module } from '../s3/s3.module';
import { ConfigModule } from '../config/config.module';
import { AudioMetaModule } from '../audio-meta/audio-meta.module';
import { AudiosService } from './audios.service';
import { Audio } from './entities/audio.entity';
import { RenderServiceModule } from '../render-service/render-service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Audio]),
    AuthModule,
    S3Module,
    ConfigModule,
    AudioMetaModule,
    RenderServiceModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsCrdMapper, AudiosService]
})
export class ProjectsModule {}
