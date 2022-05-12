import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserService } from "@app/user/user.service";
import { UserEntity } from "@app/user/user.entity";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body("user") createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    return await this.userService.createUser(createUserDto);
  }
}
