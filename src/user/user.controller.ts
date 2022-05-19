import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserService } from "@app/user/user.service";
import { UserResponseInterface } from "@app/types/userResponse.interface";
import { LoginUserDto } from "@app/user/dto/loginUser.dto";
import { User } from "@app/user/decorators/user.decorator";
import { UserEntity } from "@app/user/user.entity";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("users")
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body("user") createUserDto: CreateUserDto
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post("user/login")
  @UsePipes(new ValidationPipe())
  async login(
    @Body("user") loginUserDto: LoginUserDto
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get("user")
  async currentUser(
    @User() user: UserEntity,
    @User("id") currentUserId: number
  ): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }
}
