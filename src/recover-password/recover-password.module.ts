import { Module } from '@nestjs/common';
import { RecoverPasswordService } from './recover-password.service';
import { RecoverPasswordController } from './recover-password.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "10m"
      }
    })],
  controllers: [RecoverPasswordController],
  providers: [RecoverPasswordService],
})
export class RecoverPasswordModule {}
