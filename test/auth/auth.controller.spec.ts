import { Test, TestingModule } from '@nestjs/testing';
import { StandardAuthController } from '../../src/auth/controllers/standard-auth.controller';
import { StandardAuthService } from '../../src/auth/services/standard-auth.service';

describe('AuthController', () => {
  let controller: StandardAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StandardAuthController],
      providers: [StandardAuthService]
    }).compile();

    controller = module.get<StandardAuthController>(StandardAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
