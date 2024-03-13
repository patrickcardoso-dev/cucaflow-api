import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-guard";

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
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
