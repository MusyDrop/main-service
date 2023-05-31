export interface JwtTokenPayload {
  userId: number;
  userGuid: string;
  userEmail: string;
  expiresAt: Date;
  issuedAt: Date;
  roles: string[];
}
