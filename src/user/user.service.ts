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

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!id) {
      throw new HttpException("Missing id", HttpStatus.BAD_REQUEST);
    }
    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!userExists) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }
    const emailExists = await this.prismaService.user.findMany({
      where: { 
        email: updateUserDto.email,
        NOT: {id}
      },
    });
    if (emailExists[0]) {
      throw new HttpException("E-mail already registered", HttpStatus.BAD_REQUEST);
    }    
    const encryptedPassword = await bcrypt.hash(updateUserDto.password, 10);
    await this.prismaService.user.update({
      data: {
        ...updateUserDto,
        password: encryptedPassword,
      },
      where: { id },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
