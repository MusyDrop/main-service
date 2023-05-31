import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { DeepPartial, Repository, Transaction } from 'typeorm';
import { addSeconds } from 'date-fns';
import jwt from 'jsonwebtoken';
import { ExtendedConfigService } from '../../config/extended-config.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { GeneratedJwt } from '../interfaces/generated-jwt.interface';
import { JwtPair } from '../interfaces/jwt-pair.interface';

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

  public async createRefreshToken(
    props: DeepPartial<RefreshToken>
  ): Promise<RefreshToken> {
    return await this.refreshTokensRepository.save({
      id: props.id,
      token: props.token,
      user: { id: props.id },
      expiresAt: props.expiresAt
    });
  }

  public generateAccessToken(
    payload: Omit<JwtPayload, 'expiresAt' | 'issuedAt'>
  ): GeneratedJwt {
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
    payload: Omit<JwtPayload, 'expiresAt' | 'issuedAt'>
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

  public async generateTokenPair(
    payload: Omit<JwtPayload, 'expiresAt' | 'issuedAt'>
  ): Promise<JwtPair> {
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
}
