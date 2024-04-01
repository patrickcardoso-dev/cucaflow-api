import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from '../database/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '.prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(id_user: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, date } = createTaskDto;

    const user = await this.prismaService.user.findUnique({
      where: { id: id_user },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const createdTask = await this.prismaService.task.create({
      data: {
        title,
        description,
        date,
        id_user
      },
    });

    return createdTask;
  }

  async findAll(id_user: string): Promise<Task[]> {
    const tasks = await this.prismaService.task.findMany({
      where: { id_user },
    });

    return tasks;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { title, description, date } = updateTaskDto;

    const existingTask = await this.prismaService.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new HttpException('Task not found or does not belong to this user.', HttpStatus.NOT_FOUND);
    }

    const updatedTask = await this.prismaService.task.update({
      where: { id },
      data: {
        title: title || existingTask.title,
        description: description || existingTask.description,
        date: date || existingTask.date,
      },
    });

    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.task.delete({
      where: { id },
    });
  }
}
