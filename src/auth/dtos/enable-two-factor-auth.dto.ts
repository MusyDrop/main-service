import { IsNotEmpty, IsString } from 'class-validator';

export class EnableTwoFactorAuthDto {
  @IsString()
  @IsNotEmpty()
  authCode: string;
}
