import { Controller, Get, Query } from '@nestjs/common';
import { VerifyEmailQueryDto } from '../dtos/verify-email-query.dto';
import { EmailVerificationsService } from '../services/email-verifications.service';
import { SuccessResponseDto } from '../../common/dtos/success-response.dto';

@Controller('/auth/email-verifications')
export class EmailVerificationsController {
  constructor(
    private readonly emailVerificationsService: EmailVerificationsService
  ) {}

  @Get('/verify')
  public async verify(
    @Query() query: VerifyEmailQueryDto
  ): Promise<SuccessResponseDto> {
    await this.emailVerificationsService.verify(query.guid);
    return new SuccessResponseDto('Email Verification');
  }

  // // TODO: Guard this route
  // @Post('/resend')
  // public async resend(): Promise<void> {
  //   await this.emailVerificationsService.sendEmailVerification()
  // }
}
