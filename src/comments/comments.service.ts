import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import { CommentForm } from './comments.interface';
import { createQueryBuilder } from 'typeorm';
import { PaginationParam, simplePagination } from '../common/pagination';
import { User } from '../users/user.entity';

@Injectable()
export class CommentsService {
  async getOne(id) {
    return Comment.findOneOrFail(id, {
      relations: ['user', 'parent'],
    });
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
      ...commentForm,
      commentType: targetComment.commentType,
      commentTypeId: targetComment.commentTypeId,
      user,
      parent: targetComment,
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
      parent: null,
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
      .leftJoinAndSelect('Comment.user', 'User', 'Comment.userId = User.id')
      .leftJoinAndSelect(
        'Comment.parent',
        'ParentComment',
        'Comment.parentId = ParentComment.id',
      )
      .where(
        'Comment.commentType = :commentType AND Comment.CommentTypeId = :commentTypeId',
        {
          commentType: commentType,
          commentTypeId: commentTypeId,
        },
      );
    return simplePagination(query, paginationParam);
  }

  /**
   * return the star count of the comment
   */
  async starCount(commentId): Promise<number> {
    return await createQueryBuilder()
      .select()
      .from('user_comment_star', 'UserCommentStar')
      .where('UserCommentStar.commentId = :commentId', {
        commentId: commentId,
      })
      .getCount();
  }

  /**
   * determine the comment whether stared by give user
   * @param commentId
   * @param userId
   */
  async isStarByGivenUser(commentId, userId): Promise<boolean> {
    const count = await createQueryBuilder()
      .select()
      .from('user_comment_star', 'UserCommentStar')
      .where(
        'UserCommentStar.userId = :userId AND UserCommentStar.commentId = :commentId',
        {
          userId: userId,
          commentId: commentId,
        },
      )
      .getCount();

    console.log('count=', count);

    return count > 0;
  }

  /**
   * star comment with give userId
   * @param commentId
   * @param userId
   */
  async star(commentId, userId): Promise<number> {
    const isStar = await this.isStarByGivenUser(commentId, userId);

    console.log('isStar=', isStar);

    if (isStar) {
      throw new HttpException(
        'the resource is already star by current user',
        HttpStatus.FORBIDDEN,
      );
    }

    await createQueryBuilder()
      .insert()
      .into('user_comment_star')
      .values([
        {
          userId: userId,
          commentId: commentId,
        },
      ])
      .execute();
    return this.starCount(commentId);
  }

  /**
   * unStar comment with give userId
   * @param commentId
   * @param userId
   */
  async unStar(commentId, userId): Promise<number> {
    await createQueryBuilder()
      .delete()
      .from('user_comment_star')
      .where('userId = :userId AND commentId = :commentId', {
        userId: userId,
        commentId: commentId,
      })
      .execute();

    return this.starCount(commentId);
  }

  async starUsers(commentId, paginationParam: PaginationParam) {
    const query = createQueryBuilder(User)
      .innerJoinAndSelect(
        'user_comment_star',
        'UserCommentStar',
        'UserCommentStar.userId = User.id',
      )
      .where('UserCommentStar.commentId = :commentId', {
        commentId: commentId,
      });

    return simplePagination(query, paginationParam);
  }

  async getCommentsCountByCommentTypeAndCommentTypeId(
    commentType: string,
    commentTypeId: number,
  ) {
    return await createQueryBuilder(Comment, 'Comment')
      .where(
        'Comment.commentType = :commentType AND commentTypeId = :commentTypeId',
        {
          commentType: commentType,
          commentTypeId: commentTypeId,
        },
      )
      .getCount();
  }
}
