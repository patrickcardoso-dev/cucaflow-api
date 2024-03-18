import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./database/prisma.module";
import { AuthModule } from './auth/auth.module';
import { RecoverPasswordModule } from './recover-password/recover-password.module';
import { MailerModuleSend } from './mailer/mailer.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, RecoverPasswordModule, MailerModuleSend],
  controllers: [],
  providers: [],
})

export class AppModule {}
