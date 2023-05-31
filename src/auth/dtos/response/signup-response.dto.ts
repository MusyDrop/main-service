export class SignupResponseDto {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  email: string;
  userGuid: string;
  emailVerificationGuid: string;
}
