import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleSignupDto {
  @IsString()
  @IsNotEmpty()
  authCode: string;
}
