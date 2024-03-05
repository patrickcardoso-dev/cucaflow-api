import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
