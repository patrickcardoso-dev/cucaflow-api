import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UploadedFile, UseInterceptors, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from "src/auth/guards/jwt-guard";
import { Express } from 'express';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
 
  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findById(@Param("id") id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @HttpCode(204)
  @UseInterceptors(FileInterceptor('avatar'))
  update(@Param("id") id: string, @UploadedFile()  avatar: Express.Multer.File, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, avatar, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id") id: string, @Body("password") password: string) {
    return this.userService.remove(id, password);
  }
}