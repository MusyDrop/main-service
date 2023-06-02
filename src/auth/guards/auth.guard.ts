import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { ParsedCookiesPayload } from '../interfaces/parsed-cookies-payload.interface';
import { JwtTokensService } from '../services/jwt-tokens.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtTokensService: JwtTokensService,
    private readonly usersService: UsersService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const cookies = request.cookies as ParsedCookiesPayload;
    console.log(request.headers);
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

    const user = await this.usersService.findOne({ id: payload.userId });

    request.user = user;

    return true;
  }
}
