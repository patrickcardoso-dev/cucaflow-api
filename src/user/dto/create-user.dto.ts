import { IsEmail, IsString, IsNotEmpty } from "@nestjs/class-validator";

export class CreateUserDto {
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