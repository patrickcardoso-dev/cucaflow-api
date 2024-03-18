import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, Length } from "@nestjs/class-validator";

export class UpdateRecoverPasswordDto{
	@IsNotEmpty()
    @IsString()
    @Length(6, 12)
    password: string;
}
