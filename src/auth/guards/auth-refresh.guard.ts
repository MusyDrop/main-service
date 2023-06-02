import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { ParsedCookiesPayload } from '../interfaces/parsed-cookies-payload.interface';
import { JwtTokensService } from '../services/jwt-tokens.service';

/**
 * Used only for refresh token requiring routes so far
 */
@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(private readonly jwtTokensService: JwtTokensService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const cookies = request.cookies as ParsedCookiesPayload;

    if (!cookies.Refresh) {
      throw new UnauthorizedException(
        'Please log in in order to continue using this API'
      );
    }

    const payload = await this.jwtTokensService.verifyRefreshToken(
      cookies.Refresh
    );

    if (!payload) {
      throw new UnauthorizedException(
        'Invalid refresh token passed, please provide a valid one'
      );
    }
    const refreshToken = await this.jwtTokensService.findRefreshTokenNullable({
      token: cookies.Refresh
    });

    // Not found either because it doesn't exist in the DB (should not happen)
    // Or it was softly deleted (the only case, otherwise secret was stolen :))
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Invalid refresh token passed, please provide a valid one'
      );
    }

    request.userId = payload.userId;
    request.email = payload.userEmail;
    request.refreshToken = cookies.Refresh;

    return true;
  }
}
