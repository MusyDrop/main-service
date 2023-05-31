export interface JwtPayload {
  userId: number;
  userGuid: string;
  userEmail: string;
  expiresAt: Date;
  issuedAt: Date;
  roles: string[];
}
