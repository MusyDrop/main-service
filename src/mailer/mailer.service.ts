import { Injectable } from '@nestjs/common';
import mailer from '@sendgrid/mail';
import { ExtendedConfigService } from '../config/extended-config.service';
import { AnyObject } from '../utils/types';
import { VerificationEmailPayload } from './interfaces/verification-email.interface';

@Injectable()
export class MailerService {
  constructor(private readonly config: ExtendedConfigService) {
    mailer.setApiKey(config.get('mailer.apiKey'));
  }

  public async send(
    to: string,
    subject: string,
    templateId: string,
    dynamicTemplateData: AnyObject
  ): Promise<void> {
    await mailer.send({
      to,
      from: this.config.get('mailer.sender'),
      subject,
      templateId,
      dynamicTemplateData
    });
  }

  public async sendEmailVerification(
    to: string,
    verificationGuid: string
  ): Promise<void> {
    const base = this.config.get('server.fullUrl');

    const payload: VerificationEmailPayload = {
      verificationLink: `${base}/email-verifications/verify?guid=${verificationGuid}`,
      serverHealthEndpoint: `${base}/health`
    };

    await this.send(
      to,
      'MusyDrop Email Verification',
      this.config.get('mailer.templates.verification'),
      payload
    );
  }
}
