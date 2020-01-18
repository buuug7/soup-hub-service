import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
}
