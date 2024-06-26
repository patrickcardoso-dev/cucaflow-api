import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post(':id_user')
  create(@Param('id_user') id_user: string, @Body() createTaskDto: CreateTaskDto) {
    console.log("Entrou no controller.");
    return this.taskService.create(id_user, createTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id_user')
  async findAll(@Param('id_user') id_user: string) {
    return this.taskService.findAll(id_user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, UpdateTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id_user')
  async remove(@Param('id_user') id_user: string, @Param('id_user') v: string): Promise<void> {
    try {
      await this.taskService.remove(id_user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);        
      }
      throw error;
    }
  }
}