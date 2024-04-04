import { Module } from '@nestjs/common';
import { CheckEmailService } from './check-email.service';
import { CheckEmailController } from './check-email.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "24h"
      }
    })],
  controllers: [CheckEmailController],
  providers: [CheckEmailService],
  exports: [CheckEmailService],
})
export class CheckEmailModule {}
