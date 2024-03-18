import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT, // Correct port for Mailtrap with STARTTLS
          secure: false, // Mailtrap uses STARTTLS for encryption
          auth: { 
            user: process.env.MAIL_USER, // Replace with your Mailtrap username
            pass: process.env.MAIL_PASS, // Replace with your Mailtrap password (avoid storing in code)
          },
        },
        defaults: {
          from: `"CUCAFLOW" <${process.env.MAIL_REMETENT}>`, // Consider using a Mailtrap-generated email for consistency
        },
      }),
    }),
  ],
})
export class MailerModuleSend {} 
 