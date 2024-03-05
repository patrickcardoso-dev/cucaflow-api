import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [],
  providers: [],
})

export class AppModule {}
