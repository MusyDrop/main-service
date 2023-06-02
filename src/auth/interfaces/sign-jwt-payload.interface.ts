export interface SignJwtPayload {
  userId: number;
  userGuid: string;
  userEmail: string;
  isTwoFactorAuthGranted: boolean;
  roles: string[];
}
