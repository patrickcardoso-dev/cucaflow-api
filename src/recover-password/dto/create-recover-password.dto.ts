import { IsEmail, IsNotEmpty } from "@nestjs/class-validator";
export class CreateRecoverPasswordDto {
	@IsNotEmpty()
    @IsEmail()
    email: string;
}
