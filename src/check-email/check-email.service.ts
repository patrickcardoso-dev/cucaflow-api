import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { CreateCheckEmailDto } from './dto/create-check-email.dto';
import { UpdateCheckEmailDto } from './dto/update-check-email.dto';
import { PrismaService } from "../database/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CheckEmailService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
    ) { };

  async create(createCheckEmailDto: CreateCheckEmailDto) {

    const user = await this.prismaService.user.findUnique({
      where: {
        email: createCheckEmailDto.email,
      },
    });

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    };

    const payload = { email:  user.email };

    const verificationToken = await this.jwtService.signAsync(payload);
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'cucaflow password recovery',
        template: 'password-recovery',
        context: {
          nome: user.username,
          link: process.env.APPLICATION_URL+`check-email?token=${verificationToken}`,
        },
      });
    return;
  }

  async update(token: string, updateCheckEmailDto: UpdateCheckEmailDto) {
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

      await this.prismaService.user.update({
        data: {
          verifiedEmail: true,
        },
        where: { email: payload.email },
      });

      return payload
    } catch(error) {
      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }
  }
}
