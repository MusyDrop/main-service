import { Test, TestingModule } from '@nestjs/testing';
import { StandardAuthService } from '../../src/auth/services/standard-auth.service';

describe('AuthService', () => {
  let service: StandardAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StandardAuthService],
    }).compile();

    service = module.get<StandardAuthService>(StandardAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
