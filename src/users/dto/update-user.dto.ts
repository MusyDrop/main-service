import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateProfileDto } from './update-profile.dto';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @Type(() => UpdateProfileDto)
  @IsOptional()
  profile: UpdateProfileDto = {};
}
