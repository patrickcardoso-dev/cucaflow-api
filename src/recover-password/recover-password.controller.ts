import { Controller, Post, Body, Patch, Query, HttpCode } from '@nestjs/common';
import { RecoverPasswordService } from './recover-password.service';
import { CreateRecoverPasswordDto } from './dto/create-recover-password.dto';
import { UpdateRecoverPasswordDto } from './dto/update-recover-password.dto';

@Controller('recover-password')
export class RecoverPasswordController {
  constructor(private readonly recoverPasswordService: RecoverPasswordService) {}

  @Post()
  @HttpCode(200)
  create(@Body() createRecoverPasswordDto: CreateRecoverPasswordDto) {
    return this.recoverPasswordService.create(createRecoverPasswordDto);
  }
 
  @Patch()
  @HttpCode(204)
  update(@Query('token') token: string, @Body() updateRecoverPasswordDto: UpdateRecoverPasswordDto) {
    return this.recoverPasswordService.update(token, updateRecoverPasswordDto);
  }
}
