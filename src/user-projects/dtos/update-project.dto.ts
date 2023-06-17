import { AnyObject } from '../../utils/utility-types';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsObject()
  @IsOptional()
  settings?: AnyObject;
}
