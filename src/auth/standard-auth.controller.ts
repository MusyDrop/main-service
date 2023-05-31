import { Body, Controller, Post } from '@nestjs/common';
import { StandardAuthService } from './services/standard-auth.service';
import { SignupDto } from './dtos/signup.dto';
import { SignupResponseDto } from './dtos/response/signup-response.dto';

@Controller('/standard-auth')
export class StandardAuthController {
  constructor(private readonly standardAuthService: StandardAuthService) {}

  @Post('/signup')
  public async signup(@Body() body: SignupDto): Promise<SignupResponseDto> {
    return await this.standardAuthService.signup(body);
  }
}
