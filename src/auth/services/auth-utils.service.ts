import { Injectable } from '@nestjs/common';
import { ExtendedConfigService } from '../../config/extended-config.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthUtilsService {
  constructor(private readonly config: ExtendedConfigService) {}

  public async comparePasswordCandidate(
    passwordCandidate: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(passwordCandidate, hash);
  }

  public async generateBcryptHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
