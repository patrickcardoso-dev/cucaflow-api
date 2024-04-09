import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsDate } from "@nestjs/class-validator";

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsBoolean()
    completed: boolean;
}
