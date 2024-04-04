import { IsEmail, IsNotEmpty } from "@nestjs/class-validator";
export class CreateCheckEmailDto {
	@IsNotEmpty()
    @IsEmail()
    email: string;
}
