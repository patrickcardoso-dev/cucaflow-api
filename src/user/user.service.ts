import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../database/prisma.service";
import { createClient } from '@supabase/supabase-js';
import { Express } from 'express';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { MailerService } from '@nestjs-modules/mailer';
import { CheckEmailService } from '../check-email/check-email.service';

@Injectable()
export class UserService {
  constructor(
     private readonly prismaService: PrismaService ,
     private readonly jwtService: JwtService,
     private readonly mailerService: MailerService
  ) {}

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

    const payload = { email:  user.email };

    const verificationToken = await this.jwtService.signAsync(payload);
    await this.mailerService
      .sendMail({
        to: createUserDto.email,
        subject: 'cucaflow password recovery',
        template: 'password-recovery',
        context: {
          nome: createUserDto.username,
          link: process.env.APPLICATION_URL+`check-email?token=${verificationToken}`,
        },
      });

    const { password, ...userData } = user;
    return userData;
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

  async findByEmail(email: string) {
    if (!email) {
      throw new HttpException("Missing email", HttpStatus.BAD_REQUEST);
    };

    const user = await this.prismaService.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    };

    return user;
  }

  async update(id: string, avatar: Express.Multer.File, updateUserDto: UpdateUserDto) {
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