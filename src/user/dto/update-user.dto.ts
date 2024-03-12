import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsString, IsOptional } from "@nestjs/class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto){
    @IsOptional()
    @IsString()
    avatar: string
}
