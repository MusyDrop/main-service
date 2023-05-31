export interface JwtPair {
  accessToken: string;
  accessTokenExpiresAt: Date;
  accessTokenCookie: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  refreshTokenCookie: string;
}
