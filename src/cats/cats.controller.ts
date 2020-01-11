import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  SetMetadata,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Cat } from './cat.interface';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from '../http-exception.filter';
import { CreateCatDto } from './create-cat.dto';
import { JoiValidationPipe } from './joi-validation.pipe';
import * as Joi from '@hapi/joi';
import { ValidationPipe } from './validation.pipe';
import { RolesGuard } from '../roles.guard';
import { LoginInterceptor } from '../login.interceptor';
import { User } from '../user.decorator';

const createCatSchema = Joi.object({
  name: Joi.string()
    .max(8)
    .min(3)
    .required(),
  age: Joi.number(),
  breed: Joi.string(),
});

@UseGuards(RolesGuard)
@SetMetadata('roles', ['admin'])
@Controller('cats')
@UseInterceptors(LoginInterceptor)
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
  findAll(@User() user): Promise<Cat[]> {
    // throw new HttpException('fuck', HttpStatus.FORBIDDEN);

    console.log('user=', user);
    return this.catsService.findAll();
  }
}
