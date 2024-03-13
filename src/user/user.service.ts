import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../database/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const userEmailExists = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (userEmailExists) {
      throw new HttpException("Email already in use", HttpStatus.BAD_REQUEST);
    };

    const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        ...createUserDto, 
        password: encryptedPassword
      }
    });

    const { password, ...userData } = user;
    return userData;
  }

  async findUserById(id: string) {
    if (!id) {
      throw new HttpException("Missing id", HttpStatus.BAD_REQUEST);
    };

    const user = await this.prismaService.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    };

    const { password, ...userData } = user;
    return userData;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!id) {
      throw new HttpException("Missing id", HttpStatus.BAD_REQUEST);
    };

    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    };

    if (updateUserDto.username) {
      await this.prismaService.user.update({
        data: {
          username: updateUserDto.username,
        },
        where: { id },
      });
    };

    if (updateUserDto.email) {
      const emailExists = await this.prismaService.user.findUnique({
        where: { 
          email: updateUserDto.email
        },
      });

      if (emailExists) {
        throw new HttpException("Email already in use", HttpStatus.BAD_REQUEST);
      }

      await this.prismaService.user.update({
        data: {
          email: updateUserDto.email,
        },
        where: { id },
      });
    };

    if (updateUserDto.password) {
      const encryptedPassword = await bcrypt.hash(updateUserDto.password, 10);

      await this.prismaService.user.update({
        data: {
          password: encryptedPassword,
        },
        where: { id },
      });
    };
  };

  async remove(id: string, password: string) {
    if (!id) {
      throw new HttpException("Missing id", HttpStatus.BAD_REQUEST);
    };

    if (!password) {
      throw new HttpException("Missing password", HttpStatus.BAD_REQUEST);
    };

    const user = await this.prismaService.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    };

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new HttpException("Invalid password", HttpStatus.UNAUTHORIZED);
    };

    return await this.prismaService.user.delete({
      where: {id}
    });
  }
}
