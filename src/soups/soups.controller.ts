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
import { CommentForm } from '../comments/comments.interface';

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

  @Get()
  async list() {
    return this.soupsService.list();
  }

  @Post('star/:id')
  @UseGuards(AuthGuard('jwt'))
  async star() {
    return this.soupsService.star();
  }

  @Post('unStar/:id')
  @UseGuards(AuthGuard('jwt'))
  async unStar() {
    return this.soupsService.unStar();
  }

  @Post(':id/comment')
  @UseGuards(AuthGuard('jwt'))
  createComment(
    @Body() commentForm: CommentForm,
    @Param('id') soupId,
    @Req() req,
  ) {

    console.log('commentForm=', commentForm);
    return this.soupsService.createComment(soupId, commentForm, req.user);
  }
}
