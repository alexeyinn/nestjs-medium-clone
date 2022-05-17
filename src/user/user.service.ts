import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { Repository } from "typeorm";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "@app/config";
import { UserResponseInterface } from "@app/types/userResponse.interface";
import { compare } from "bcrypt";
import { LoginUserDto } from "@app/user/dto/loginUser.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const userByUserName = await this.userRepository.findOne({
      userName: createUserDto.userName,
    });
    if (userByEmail || userByUserName) {
      throw new HttpException(
        "Email or username a taken",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne(
      {
        email: loginUserDto.email,
      },
      { select: ["id", "bio", "email", "image", "password", "userName"] }
    );

    if (!user) {
      throw new HttpException(
        "Credentials are not valid!",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        "Credentials are not valid!",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    delete user.password;

    return user;
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
      JWT_SECRET
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
