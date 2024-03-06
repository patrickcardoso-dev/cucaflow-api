import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString, IsNotEmpty } from "@nestjs/class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto){

}
