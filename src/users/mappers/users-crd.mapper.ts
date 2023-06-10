import { Injectable } from "@nestjs/common";
import { ResponseDtoMapper } from "../../common/types";
import { UsersController } from "../users.controller";
import { User } from "../entities/user.entity";
import { UserDto } from "../dto/user.dto";
import { UpdateUserResponseDto } from "../dto/response/update-user-response.dto";
import { GetUserResponseDto } from "../dto/response/get-user-response.dto";

@Injectable()
export class UsersCrdMapper implements ResponseDtoMapper<UsersController> {
  public updateMapper(user: User): UpdateUserResponseDto {
    return {
      user: User.toDto(user) as UserDto
    };
  }

  public findOneMapper(user: User): GetUserResponseDto {
    return {
      user: User.toDto(user) as UserDto
    };
  }
}
