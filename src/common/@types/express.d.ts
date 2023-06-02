declare namespace Express {
  import { startTime } from 'pino-http';
  import { ParsedCookiesPayload } from '../../auth/interfaces/parsed-cookies-payload.interface';

  export interface Request {
    /**
     * Set by cookie parser
     */
    cookies: ParsedCookiesPayload;
    /**
     * Auth token (Access token) used by auth middleware in userway BE
     */
    forwardedForIp: string;
    /**
     * JWT Payload from SSO Token
     */
    id: string;
    /**
     * Set by Auth Guards
     */
    userId?: number;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  export interface Response {
    [startTime]: number;
  }
}
