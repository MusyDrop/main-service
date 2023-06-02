import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { ParsedCookiesPayload } from '../interfaces/parsed-cookies-payload.interface';
import { JwtTokensService } from '../services/jwt-tokens.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtTokensService: JwtTokensService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const cookies = request.cookies as ParsedCookiesPayload;

    if (!cookies.Auth) {
      throw new UnauthorizedException(
        'Please log in in order to continue using this API'
      );
    }

    const payload = await this.jwtTokensService.verifyAccessToken(cookies.Auth);

    if (!payload) {
      throw new UnauthorizedException(
        'Invalid access token passed, please provide a valid one'
      );
    }

    request.userId = payload.userId;
    request.email = payload.userEmail;
    request.accessToken = cookies.Auth;

    return true;
  }
}
