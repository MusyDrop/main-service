import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { AuthTwoFactorGuard } from '../auth/guards/auth-two-factor.guard';
import { UsersCrdMapper } from './mappers/users-crd.mapper';

@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly responseMapper: UsersCrdMapper
  ) {}

  @UseGuards(AuthTwoFactorGuard)
  @Patch('/')
  public async update(
    @Req() req: Request,
    @Body() body: UpdateUserDto
  ): Promise<UserDto> {
    const user = await this.usersService.updateByIdAndReturn(req.user.id, body);
    return this.responseMapper.updateMapper(user);
  }
}
