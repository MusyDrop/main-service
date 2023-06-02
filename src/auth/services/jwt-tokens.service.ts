import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { DeepPartial, Repository } from 'typeorm';
import { addSeconds } from 'date-fns';
import jwt from 'jsonwebtoken';
import { ExtendedConfigService } from '../../config/extended-config.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { GeneratedJwt } from '../interfaces/generated-jwt.interface';
import { JwtPair } from '../interfaces/jwt-pair.interface';
import { SignJwtPayload } from '../interfaces/sign-jwt-payload.interface';

@Injectable()
export class JwtTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
    private readonly config: ExtendedConfigService
  ) {}

  public async findRefreshTokenNullable(
    props: DeepPartial<RefreshToken>
  ): Promise<RefreshToken | null> {
    return await this.refreshTokensRepository.findOneBy({
      id: props.id,
      token: props.token,
      user: { id: props.id }
    });
  }

  public generateAccessToken(payload: SignJwtPayload): GeneratedJwt {
    const expiresSecs = this.config.get('auth.accessTokenExpiresInSec');
    const issuedAt = new Date();
    const expiresAt = addSeconds(issuedAt, expiresSecs);

    const token = jwt.sign(
      {
        ...payload,
        expiresAt,
        issuedAt
      } as JwtPayload,
      this.config.get('auth.accessTokenSecret'),
      {
        expiresIn: expiresSecs
      }
    );

    const cookie = `Auth=${token}; HttpOnly; Path=/; Expires=${expiresAt}`;

    return {
      token,
      expiresAt,
      cookie
    };
  }

  public async generateRefreshToken(
    payload: SignJwtPayload
  ): Promise<GeneratedJwt> {
    // soft delete all other refresh tokens
    await this.refreshTokensRepository.softDelete({
      user: { id: payload.userId }
    });

    const expiresSecs = this.config.get('auth.refreshTokenExpiresInSec');
    const issuedAt = new Date();
    const expiresAt = addSeconds(issuedAt, expiresSecs);

    const token = jwt.sign(
      {
        ...payload,
        expiresAt,
        issuedAt
      } as JwtPayload,
      this.config.get('auth.refreshTokenSecret'),
      {
        expiresIn: expiresSecs
      }
    );

    await this.refreshTokensRepository.save({
      isTwoFactorAuthGranted: payload.isTwoFactorAuthGranted,
      token,
      expiresAt,
      user: { id: payload.userId }
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Expires=${expiresAt}`;

    return {
      token,
      expiresAt,
      cookie
    };
  }

  public async generateTokenPair(payload: SignJwtPayload): Promise<JwtPair> {
    const {
      token: accessToken,
      expiresAt: accessTokenExpiresAt,
      cookie: accessTokenCookie
    } = this.generateAccessToken(payload);
    const {
      token: refreshToken,
      expiresAt: refreshTokenExpiresAt,
      cookie: refreshTokenCookie
    } = await this.generateRefreshToken(payload);

    return {
      accessToken,
      accessTokenExpiresAt,
      accessTokenCookie,
      refreshToken,
      refreshTokenExpiresAt,
      refreshTokenCookie
    };
  }

  /**
   * Verifies access token
   * @returns null in case token is invalid
   * @param token
   */
  public async verifyAccessToken(token: string): Promise<JwtPayload | null> {
    try {
      return jwt.verify(
        token,
        this.config.get('auth.accessTokenSecret')
      ) as JwtPayload;
    } catch (e) {
      return null;
    }
  }

  public async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
      return jwt.verify(
        token,
        this.config.get('auth.refreshTokenSecret')
      ) as JwtPayload;
    } catch (e) {
      return null;
    }
  }

  public async softDeleteRefreshTokensByUserId(userId: number): Promise<void> {
    await this.refreshTokensRepository.softDelete({
      user: { id: userId }
    });
  }
}
