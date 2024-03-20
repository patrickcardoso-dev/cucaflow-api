import { IsEmail, IsString, IsNotEmpty, Length, IsBoolean, IsOptional } from "@nestjs/class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(3)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 12)
    password: string;

    @IsOptional()
    @IsBoolean()
    isSocialLogin: boolean;
}