import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({ 
      useFactory: async () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
          secure: false,
          auth: { 
            user: process.env.MAIL_USER, 
            pass: process.env.MAIL_PASS, 
          }, 
        },
        defaults: {
          from: `"CUCAFLOW" <${process.env.MAIL_REMETENT}>`,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
          strict: true,
          },
        }
      }),
    }),
    ],
})
export class MailerModuleSend {} 
