import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from '../http-exception.filter';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @UseFilters(new HttpExceptionFilter())
  findAll(): Promise<Cat[]> {
    throw new HttpException('fuck', HttpStatus.FORBIDDEN);
    return this.catsService.findAll();
  }
}
