import { Test, TestingModule } from '@nestjs/testing';
import { MailerController } from '../../src/mailer/mailer.controller';
import { MailerService } from '../../src/mailer/mailer.service';

describe('MailerController', () => {
  let controller: MailerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailerController],
      providers: [MailerService],
    }).compile();

    controller = module.get<MailerController>(MailerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
