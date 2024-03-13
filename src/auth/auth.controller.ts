import { Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import LocalAuthGuard from './guards/local-guard';
import { User } from '@prisma/client';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post("signIn")
    @HttpCode(200)
	async signIn(@Req() req: Request, @Res() res: Response) {
		const user = req.user as User;

		const token = await this.authService.signIn(user);

		return res.json({
			user_id: user.id,
			token: token.access_token
		});
	}
}
