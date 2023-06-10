import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTwoFactorGuard } from '../auth/guards/auth-two-factor.guard';
import { UsersCrdMapper } from './mappers/users-crd.mapper';
import { UpdateUserResponseDto } from './dto/response/update-user-response.dto';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';

@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly responseMapper: UsersCrdMapper
  ) {}

  @UseGuards(AuthTwoFactorGuard)
  @Patch('/me')
  public async update(
    @Req() req: Request,
    @Body() body: UpdateUserDto
  ): Promise<UpdateUserResponseDto> {
    const user = await this.usersService.updateByIdAndReturn(req.user.id, body);
    return this.responseMapper.updateMapper(user);
  }

  @UseGuards(AuthTwoFactorGuard)
  @Get('/me')
  public async findOne(@Req() req: Request): Promise<GetUserResponseDto> {
    const user = await this.usersService.findOneWithProfile({
      id: req.user.id
    });
    return this.responseMapper.findOneMapper(user);
  }
}
