import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsString, IsOptional } from "@nestjs/class-validator";

export class UpdateTaskDto extends PartialType(CreateTaskDto){

}
