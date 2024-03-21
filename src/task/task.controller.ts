import { HttpCode, Controller, Get, Post, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, UseGuards } from "@nestjs/common";
import { taskService } from "./task.service"
import { createTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from "src/auth/guards/jwt-guard";


@Controller("task")
export class taskController {
    constructor(private readonly taskService: taskService) {}

    @Post()
    @HttpCode(201)
    create(@Body() createTaskDto: createTaskDto) {
      return this.taskService.create(createTaskDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    findById(@Param("id") id: string) {
      return this.taskService.findById(id);
    }

    
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @HttpCode(204)
  @UseInterceptors(FileInterceptor('avatar'))
  update(@Param("id") id: string, @UploadedFile()  avatar: Express.Multer.File, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, avatar, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id") id: string, @Body("password") password: string) {
    return this.taskService.remove(id, password);
  }
}