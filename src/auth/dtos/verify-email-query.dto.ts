import { IsUUID } from 'class-validator';

export class VerifyEmailQueryDto {
  @IsUUID()
  guid: string;
}
