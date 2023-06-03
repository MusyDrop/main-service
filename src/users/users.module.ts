import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { AuthModule } from '../auth/auth.module';
import { ProfilesService } from './profiles.service';
import { UsersCrdMapper } from './mappers/users-crd.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    forwardRef(() => AuthModule)
  ],
  controllers: [UsersController],
  providers: [UsersService, ProfilesService, UsersCrdMapper],
  exports: [UsersService, ProfilesService]
})
export class UsersModule {}
