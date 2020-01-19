import { Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import { CommentForm } from './comments.interface';
import { createQueryBuilder } from 'typeorm';
import { PaginationParam, simplePagination } from '../common/pagination';

@Injectable()
export class CommentsService {
  async getOne(id) {
    return Comment.findOneOrFail(id);
  }

  /**
   * reply a comment
   * @param targetCommentId
   * @param commentForm
   * @param user
   */
  async reply(targetCommentId, commentForm: CommentForm, user) {
    const targetComment = await Comment.findOneOrFail(targetCommentId);
    const comment = Comment.create({
      content: commentForm.content,
      commentType: targetComment.commentType,
      commentTypeId: targetComment.commentTypeId,
      user,
      targetComment: targetComment,
      createdAt: new Date(),
    });

    return await comment.save();
  }

  /**
   * create new comment
   * @param commentForm
   * @param commentType
   * @param commentTypeId
   * @param user
   */
  async create({ commentForm, commentType, commentTypeId, user }) {
    const comment = Comment.create({
      ...commentForm,
      commentType,
      commentTypeId,
      user,
      targetComment: null,
      createdAt: new Date(),
    });

    return comment.save();
  }

  /**
   * get comments by commentType and commentTypeId
   * @param commentType
   * @param commentTypeId
   * @param paginationParam
   */
  async getCommentsByTypeAndTypeId(
    commentType,
    commentTypeId,
    paginationParam: PaginationParam,
  ) {
    const query = createQueryBuilder(Comment, 'Comment')
      .leftJoinAndSelect('Comment.user', 'User')
      .where(
        'Comment.commentType = :commentType AND Comment.CommentTypeId = :commentTypeId',
        {
          commentType: commentType,
          commentTypeId: commentTypeId,
        },
      );
    return simplePagination(query, paginationParam);
  }
}
