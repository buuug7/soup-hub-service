import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentForm } from './comments.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async show(@Param('id') id) {
    return this.commentsService.getOne(id);
  }

  @Post(':id/reply')
  @UseGuards(AuthGuard('jwt'))
  async reply(
    @Body() commentForm: CommentForm,
    @Param('id') targetCommentId,
    @Req() req,
  ) {
    console.log('req=', req.user);
    return this.commentsService.reply(targetCommentId, commentForm, req.user);
  }

  @Post(':id/star')
  @UseGuards(AuthGuard('jwt'))
  async star(@Param('id') commentId, @Req() req) {
    return this.commentsService.star(commentId, req.user.id);
  }

  @Post(':id/unStar')
  @UseGuards(AuthGuard('jwt'))
  async unStar(@Param('id') commentId, @Req() req) {
    return this.commentsService.unStar(commentId, req.user.id);
  }

  @Get(':id/starCount')
  async starCount(@Param('id') commentId) {
    return this.commentsService.starCount(commentId);
  }

  @Get(':id/starUsers')
  async starUsers(@Param('id') commentId, @Query() queryParam) {
    return this.commentsService.starUsers(commentId, queryParam);
  }
}
