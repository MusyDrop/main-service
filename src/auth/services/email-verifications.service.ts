import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from '../entities/email-verification.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ExtendedConfigService } from '../../config/extended-config.service';
import { MailerService } from '../../mailer/mailer.service';

@Injectable()
export class EmailVerificationsService {
  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    private readonly config: ExtendedConfigService,
    private readonly mailer: MailerService
  ) {}

  public async findOneNullable(
    props: DeepPartial<EmailVerification>
  ): Promise<EmailVerification | null> {
    return await this.emailVerificationRepository.findOneBy({
      id: props.id,
      guid: props.guid,
      user: { id: props.id },
      verified: props.verified
    });
  }

  public async findAll(
    props: DeepPartial<EmailVerification>
  ): Promise<EmailVerification[]> {
    return await this.emailVerificationRepository.findBy({
      id: props.id,
      guid: props.guid,
      user: { id: props.id },
      verified: props.verified
    });
  }

  public async sendEmailVerification(
    userId: number,
    email: string
  ): Promise<EmailVerification> {
    const emailVerificationInstance = this.emailVerificationRepository.create({
      user: { id: userId }
    });
    emailVerificationInstance.setExpiredAt(
      this.config.get('auth.emailVerificationExpiresInSec')
    );
    const emailVerification = await this.emailVerificationRepository.save(
      emailVerificationInstance
    );

    await this.mailer.sendEmailVerification(email, emailVerification.guid);

    return emailVerification;
  }

  public async verify(guid: string): Promise<void> {
    const verification = await this.findOneNullable({ guid });

    if (!verification) {
      throw new BadRequestException('Unable to find this email verification');
    }

    if (verification.expiresAt < new Date()) {
      throw new BadRequestException('Email verification has expired');
    }

    await this.emailVerificationRepository.update(
      {
        guid
      },
      {
        verified: true
      }
    );
  }
}
