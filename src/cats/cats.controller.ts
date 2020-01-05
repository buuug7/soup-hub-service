import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from '../http-exception.filter';
import { CreateCatDto } from './create-cat.dto';
import { JoiValidationPipe } from './joi-validation.pipe';
import * as Joi from '@hapi/joi';
import { ValidationPipe } from './validation.pipe';

const createCatSchema = Joi.object({
  name: Joi.string()
    .max(8)
    .min(3)
    .required(),
  age: Joi.number(),
  breed: Joi.string(),
});

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  /**
   * use JOI validation
   * @param createCatDto
   */
  @Post('create1')
  @UsePipes(new JoiValidationPipe(createCatSchema))
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Post('create2')
  @UsePipes(ValidationPipe)
  async create2(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  @UseFilters(new HttpExceptionFilter())
  findAll(): Promise<Cat[]> {
    // throw new HttpException('fuck', HttpStatus.FORBIDDEN);
    return this.catsService.findAll();
  }
}
