import { Module } from '@nestjs/common';
import { TodoController } from './task.controller';
import { TodoService } from './task.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService]
})
export class TodoModule {}
