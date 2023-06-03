import { User } from '../../users/entities/user.entity';

export interface SignupInfo {
  user: User;

  accessToken: string;
  accessTokenExpiresAt: Date;
  accessTokenCookie: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  refreshTokenCookie: string;
}
