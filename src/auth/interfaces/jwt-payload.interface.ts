import { SignJwtPayload } from './sign-jwt-payload.interface';

export interface JwtPayload extends SignJwtPayload {
  expiresAt: Date;
  issuedAt: Date;
}
