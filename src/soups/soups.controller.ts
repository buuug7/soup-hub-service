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
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateSoupDto } from './create-soup.dto';
import { PaginationParam } from '../common/pagination';

@ApiTags('soups')
@Controller('soups')
export class SoupsController {
  constructor(private readonly soupsService: SoupsService) {}

  @ApiParam({
    type: String,
    name: 'id',
  })
  @Get(':id')
  async show(@Param('id') id) {
    return this.soupsService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() soupForm: CreateSoupDto, @Req() req) {
    return this.soupsService.create({
      ...soupForm,
      user: req.user,
    });
  }

  @ApiParam({
    type: String,
    name: 'id',
  })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() soupForm: CreateSoupDto, @Param('id') id) {
    return this.soupsService.update(id, soupForm);
  }

  @ApiParam({
    type: String,
    name: 'id',
  })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id) {
    return this.soupsService.delete(id);
  }

  @Get()
  async list(@Query() queryParam) {
    return this.soupsService.list(queryParam);
  }

  @ApiParam({
    type: String,
    name: 'id',
  })
  @Post(':id/star')
  @UseGuards(AuthGuard('jwt'))
  async star(@Param('id') soupId, @Req() req) {
    return this.soupsService.star(soupId, req.user.id);
  }

  @ApiParam({
    type: String,
    name: 'id',
  })
  @Post(':id/unStar')
  @UseGuards(AuthGuard('jwt'))
  async unStar(@Param('id') soupId, @Req() req) {
    return this.soupsService.unStar(soupId, req.user.id);
  }

  @ApiParam({
    type: String,
    name: 'id',
  })
  @Get(':id/starCount')
  async starCount(@Param('id') soupId) {
    return this.soupsService.starCount(soupId);
  }

  @ApiParam({
    type: String,
    name: 'id',
  })
  @Post(':id/comment')
  @UseGuards(AuthGuard('jwt'))
  createComment(
    @Body() commentForm: CommentForm,
    @Param('id') soupId,
    @Req() req,
  ) {
    return this.soupsService.createComment(soupId, commentForm, req.user);
  }

  @ApiParam({
    type: String,
    name: 'id',
  })
  @ApiQuery({
    name: 'perPage',
    type: Number,
  })
  @ApiQuery({
    name: 'currentPage',
    type: Number,
  })
  @Get(':id/comments')
  async getComments(@Param('id') soupId, @Query() queryParam) {
    return this.soupsService.getComments(soupId, queryParam);
  }
}
