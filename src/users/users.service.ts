import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { hashSync } from 'bcrypt';
import { UserCreate } from './users.interface';
import { createQueryBuilder } from 'typeorm';
import { Soup } from '../soups/soup.entity';
import { PaginationParam, simplePagination } from '../common/pagination';
import { Comment } from '../comments/comment.entity';

@Injectable()
export class UsersService {
  async findOne(email: string): Promise<User | undefined> {
    return User.createQueryBuilder('User')
      .select()
      .addSelect('User.password')
      .where('User.email = :email', {
        email,
      })
      .getOne();
  }

  async create(user: UserCreate) {
    return await User.save(
      User.create({
        ...user,
        password: hashSync(user.password, 3),
        createdAt: new Date(),
      }),
    );
  }

  /**
   * get star soups by userId
   * @param userId
   */
  async getStarSoups(userId: number, queryParam: PaginationParam) {
    const query = createQueryBuilder(Soup)
      .leftJoinAndSelect('Soup.user', 'User', 'Soup.userId = User.id')
      .innerJoinAndSelect(
        'user_soup_star',
        'UserSoupStar',
        'Soup.id = UserSoupStar.soupId',
      )
      .where('UserSoupStar.userId = :userId', {
        userId: userId,
      });

    return simplePagination(query, queryParam);
  }

  /**
   * get star comments by userId
   * @param userId
   */
  async getStarComments(userId: number, queryParam: PaginationParam) {
    const query = createQueryBuilder(Comment)
      .leftJoinAndSelect('Comment.user', 'User', 'Comment.userId = User.id')
      .innerJoinAndSelect(
        'user_comment_star',
        'UserCommentStar',
        'Comment.id = UserCommentStar.commentId',
      )
      .where('UserCommentStar.userId = :userId', { userId: userId });

    return simplePagination(query, queryParam);
  }
}
