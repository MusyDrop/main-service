import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Patch('/')
  public async update(
    @Req() req: Request,
    @Body() body: UpdateUserDto
  ): Promise<UserDto> {
    const user = await this.usersService.updateByIdAndReturn(req.userId, body);
    return {
      guid: user.guid,
      email: user.email,

      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        country: user.profile.country,
        phone: user.profile.phone
      }
    };
  }
}
