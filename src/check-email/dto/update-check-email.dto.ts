import { PartialType } from '@nestjs/mapped-types';
import { CreateCheckEmailDto } from './create-check-email.dto';

export class UpdateCheckEmailDto extends PartialType(CreateCheckEmailDto) {}
