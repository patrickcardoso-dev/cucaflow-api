import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { };

  async validateUser(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    };

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException();
    };

    return user;
  };

  async signIn(user: User) {
    const payload = { id: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  };
}
