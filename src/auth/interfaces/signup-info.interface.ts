export interface SignupInfo {
  email: string;
  userGuid: string;

  accessToken: string;
  accessTokenExpiresAt: Date;
  accessTokenCookie: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  refreshTokenCookie: string;
}
