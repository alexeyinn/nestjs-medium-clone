import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "@app/user/dto/createUser.dto";

@Injectable()
export class UserService {
  async createUser(dto: CreateUserDto): Promise<CreateUserDto> {
    return dto;
  }
}
