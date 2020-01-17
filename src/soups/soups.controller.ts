import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SoupsService } from './soups.service';
import { SoupForm } from './soups.interface';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';

@Controller('soups')
export class SoupsController {
  constructor(private readonly soupsService: SoupsService) {}

  @Get(':id')
  async show(@Param('id') id) {
    return this.soupsService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: SoupForm) {
    return this.soupsService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() body: SoupForm, @Param('id') id) {
    return this.soupsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id) {
    return this.soupsService.delete(id);
  }
}
