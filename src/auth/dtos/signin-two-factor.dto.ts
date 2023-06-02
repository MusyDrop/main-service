import { IsNotEmpty, IsString } from 'class-validator';

export class SigninTwoFactorDto {
  @IsString()
  @IsNotEmpty()
  authCode: string;
}
