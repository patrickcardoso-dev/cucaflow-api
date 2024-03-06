import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from "@nestjs/class-validator";

export class UpdateUserDto{
	@IsNotEmpty({ message: "O campo nome é obrigatório" })
    @IsString()
    username: string;

    @IsNotEmpty({ message: "O campo e-mail é obrigatório" })
    @IsEmail({}, { message: "O campo precisa receber um e-mail em formato válido" })
    email: string;

    @IsNotEmpty({ message: "O campo senha é obrigatório" })
    @IsString()
    password: string;
}
