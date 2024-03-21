import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { validate } from "class-validator";
import { createTaskDto } from "./dto/create-task.dto";
import { PrismaService } from "../database/prisma.service";
import { createClient } from '@supabase/supabase-js';
import { Express } from 'express';
import * as bcrypt from "bcrypt";

@Injectable()
export class taskService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTaskDto: createTaskDto) {
    const errors = await validate(createTaskDto);
    if (errors.length > 0) {
      throw new HttpException("Error", HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id: string) {
    if (!id) {
      throw new HttpException("Missing id", HttpStatus.BAD_REQUEST);
    };

    const user = await this.prismaService.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    };

    const { BASE_IMG_URL: baseImageUrl, BUCKET: bucket } = process.env;
    
    const { password, ...userData } = user;
    userData.avatar = `${baseImageUrl}${bucket}/${userData.avatar}`;
    
    return userData;
  }
  async update(id: string, avatar: Express.Multer.File, updateTaskDto: updateTaskDto) {
    if (!id) {
      throw new HttpException("Missing id", HttpStatus.BAD_REQUEST);
    };

    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    };

    if (updateTaskDto.username) {
      await this.prismaService.user.update({
        data: {
          username: updateTaskDto.username,
        },
        where: { id },
      });
    };

    if (updateTaskDto.email) {
      const emailExists = await this.prismaService.user.findUnique({
        where: { 
          email: updateTaskDto.email
        },
      });

      if (emailExists) {
        throw new HttpException("Email already in use", HttpStatus.BAD_REQUEST);
      }

      await this.prismaService.user.update({
        data: {
          email: updateTaskDto.email,
        },
        where: { id },
      });
    };

    if (updateTaskDto.password) {
      const encryptedPassword = await bcrypt.hash(updateTaskDto.password, 10);

      await this.prismaService.user.update({
        data: {
          password: encryptedPassword,
        },
        where: { id },
      });
    };

    if (avatar) {
      const { SUPABASE_URL: supabaseUrl, SUPABASE_KEY: supabaseKey, BUCKET: bucket } = process.env;
      
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false
        }
      });
      
      const extension = avatar.mimetype.split('/')[1];
      
      const { data } = await supabase.storage.from(bucket).upload(`${id}.jpg`, avatar?.buffer, {
        upsert: true
      });
      
      await this.prismaService.user.update({
        data: {
          avatar: data.path,
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