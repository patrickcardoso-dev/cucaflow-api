import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
 
  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(":id")
  findUserById(@Param("id") id: string) {
    return this.userService.findUserById(id);
  }

  @Patch(":id")
  @HttpCode(204)
  @UseInterceptors(FileInterceptor('avatar'))
  update(@Param("id") id: string, @UploadedFile()  avatar: Express.Multer.File, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, avatar, updateUserDto);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
