import { IsNotEmpty, IsNumber, IsString, IsDate, IsBoolean } from "class-validator";

export class createTaskDto {
    @IsNotEmpty()
    id_user: string;
  
    @IsNotEmpty()
    @IsNumber()
    id: number;
  
    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsString()
    description: string;
  
    @IsNotEmpty()
    @IsDate()
    date: Date;
  
    @IsNotEmpty()
    @IsBoolean()
    status: boolean;
  }