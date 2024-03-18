import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { toDoService } from './todo.service';
import { CreateToDoDto, UpdateToDoDto } from './toDo.dto';

@Controller('toDo')
export class toDoController {
    constructor(private readonly toDoService: toDoService) {}

    @Get()
    async findAll() {
        return this.toDoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.toDoService.findOne(id);
    }

    @Post()
    async create(@Body() createToDoDto: CreateToDoDto) {
        return this.toDoService.create(createToDoDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateToDoDto: UpdateToDoDto) {
        return this.toDoService.update(id, updateToDoDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.toDoService.remove(id);
    }
}