import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserService } from "@app/user/user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body("user") createUserDto: CreateUserDto
  ): Promise<CreateUserDto> {
    return await this.userService.createUser(createUserDto);
  }
}
