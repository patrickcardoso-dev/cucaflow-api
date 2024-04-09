import { Injectable, HttpException, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { CreateRecoverPasswordDto } from './dto/create-recover-password.dto';
import { UpdateRecoverPasswordDto } from './dto/update-recover-password.dto';
import { PrismaService } from "../database/prisma.service";
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";

@Injectable()
export class RecoverPasswordService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
    ) { };

  async create(createRecoverPasswordDto: CreateRecoverPasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: createRecoverPasswordDto.email,
      },
    });

    if(!user) {
      throw new HttpException("Email not found", HttpStatus.NOT_FOUND);
    }

    // if(user.isSocialLogin) {
    //   throw new HttpException("Unable to recover password using Google login", HttpStatus.FORBIDDEN);
    // }
    
    const payload = { email:  user.email };

    const verificationToken = await this.jwtService.signAsync(payload);
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'cucaflow password recovery',
        template: 'password-recovery',
        context: {
          nome: user.username,
          link: process.env.APPLICATION_URL+`password-recovery?token=${verificationToken}`,
        },
      });
      return
  }

  async update(token: string, updateRecoverPasswordDto: UpdateRecoverPasswordDto) {
    if(!token){
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET
        }
        );
      const encryptedPassword = await bcrypt.hash(updateRecoverPasswordDto.password, 10);

      await this.prismaService.user.update({
        data: {
          password: encryptedPassword,
        },
        where: { email: payload.email },
      });

      return payload
    } catch(error) {
      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }
    
  }
}
