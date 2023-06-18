import { AnyObject } from '../../utils/utility-types';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsObject()
  @IsOptional()
  settings?: AnyObject;

  @IsOptional()
  @IsUUID()
  templateGuid?: string;
}
