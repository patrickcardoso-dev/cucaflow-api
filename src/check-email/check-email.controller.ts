import { Controller, Post, Body, Patch, Query, HttpCode} from '@nestjs/common';
import { CheckEmailService } from './check-email.service';
import { CreateCheckEmailDto } from './dto/create-check-email.dto';
import { UpdateCheckEmailDto } from './dto/update-check-email.dto';

@Controller('check-email')
export class CheckEmailController {
  constructor(private readonly checkEmailService: CheckEmailService) {}

  @Post()
  create(@Body() createCheckEmailDto: CreateCheckEmailDto) {
    return this.checkEmailService.create(createCheckEmailDto);
  }

  @Patch()
  @HttpCode(204)
  update(@Query('token') token: string, @Body() updateCheckEmailDto: UpdateCheckEmailDto) {
    return this.checkEmailService.update(token, updateCheckEmailDto);
  }
}
