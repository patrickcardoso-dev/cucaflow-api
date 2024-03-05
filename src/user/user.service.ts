import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    if(!createUserDto){
        throw new HttpException("Missing data", HttpStatus.BAD_REQUEST);
      }

      const userEmailExists = await this.prismaService.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });

      if (userEmailExists) {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }

      const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.prismaService.user.create({
        data: {
          ...createUserDto, 
          password: encryptedPassword
        }
      })
      const { password, ...userData } = user;
      return userData;
  }

  async findUserById(id: string) {
    console.log(id)
    if (!id) {
      throw new HttpException("Missing e-mail", HttpStatus.BAD_REQUEST);
    }

    const user = await this.prismaService.user.findUnique({
      where: { id }
    })

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return { ...user }
}

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
