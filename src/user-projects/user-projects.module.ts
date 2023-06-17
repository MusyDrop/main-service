import { Module } from '@nestjs/common';
import { UserProjectsController } from './user-projects.controller';
import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from '../projects/projects.module';
import { UserProjectsCrdMapper } from './mappers/user-projects-crd.mapper';

@Module({
  imports: [AuthModule, ProjectsModule],
  controllers: [UserProjectsController],
  providers: [UserProjectsCrdMapper]
})
export class UserProjectsModule {}
