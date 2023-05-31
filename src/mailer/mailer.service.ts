import { Injectable } from '@nestjs/common';
import mailer from '@sendgrid/mail';
import { ExtendedConfigService } from '../config/extended-config.service';
import { AnyObject } from '../utils/types';

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
}
