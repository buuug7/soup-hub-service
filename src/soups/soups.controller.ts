import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
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
  async create(@Body() soupForm: SoupForm, @Req() req) {
    return this.soupsService.create({
      ...soupForm,
      user: req.user,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() soupForm: SoupForm, @Param('id') id) {
    return this.soupsService.update(id, soupForm);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id) {
    return this.soupsService.delete(id);
  }

  @Get()
  async list(@Query() queryParam) {
    return this.soupsService.list(queryParam);
  }

  @Post(':id/star')
  @UseGuards(AuthGuard('jwt'))
  async star(@Param('id') soupId, @Req() req) {
    return this.soupsService.star(soupId, req.user.id);
  }

  @Post(':id/unStar')
  @UseGuards(AuthGuard('jwt'))
  async unStar(@Param('id') soupId, @Req() req) {
    return this.soupsService.unStar(soupId, req.user.id);
  }

  @Get(':id/starCount')
  async starCount(@Param('id') soupId) {
    return this.soupsService.starCount(soupId);
  }

  @Post(':id/comment')
  @UseGuards(AuthGuard('jwt'))
  createComment(
    @Body() commentForm: CommentForm,
    @Param('id') soupId,
    @Req() req,
  ) {
    return this.soupsService.createComment(soupId, commentForm, req.user);
  }

  @Get(':id/comments')
  async getComments(@Param('id') soupId, @Query() queryParam) {
    return this.soupsService.getComments(soupId, queryParam);
  }
}
