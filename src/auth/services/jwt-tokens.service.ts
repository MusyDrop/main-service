import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { DeepPartial, Repository } from 'typeorm';
import { JwtTokenPayload } from '../interfaces/jwt-token-payload.interface';
import { addSeconds } from 'date-fns';
import jwt from 'jsonwebtoken';
import { JwtTokenPair } from '../interfaces/jwt-token-pair.interface';
import { ExtendedConfigService } from '../../config/extended-config.service';

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
    payload: Omit<JwtTokenPayload, 'expiresAt' | 'issuedAt'>
  ): [string, Date] {
    const expiresSecs = this.config.get('auth.accessTokenExpiresInSec');
    const issuedAt = new Date();
    const expiresAt = addSeconds(issuedAt, expiresSecs);

    const token = jwt.sign(
      {
        ...payload,
        expiresAt,
        issuedAt
      } as JwtTokenPayload,
      this.config.get('auth.accessTokenSecret'),
      {
        expiresIn: expiresSecs
      }
    );

    return [token, expiresAt];
  }

  public async generateRefreshToken(
    payload: Omit<JwtTokenPayload, 'expiresAt' | 'issuedAt'>
  ): Promise<[string, Date]> {
    const expiresSecs = this.config.get('auth.refreshTokenExpiresInSec');
    const issuedAt = new Date();
    const expiresAt = addSeconds(issuedAt, expiresSecs);

    const token = jwt.sign(
      {
        ...payload,
        expiresAt,
        issuedAt
      } as JwtTokenPayload,
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

    return [token, expiresAt];
  }

  public async generateTokenPair(
    payload: Omit<JwtTokenPayload, 'expiresAt' | 'issuedAt'>
  ): Promise<JwtTokenPair> {
    const [accessToken, accessTokenExpiresAt] =
      this.generateAccessToken(payload);
    const [refreshToken, refreshTokenExpiresAt] =
      await this.generateRefreshToken(payload);

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt
    };
  }
}
