import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Soup } from './soup.entity';
import { PaginationParam, simplePagination } from '../common/pagination';
import { createQueryBuilder } from 'typeorm';
import { User } from '../users/user.entity';
import { CommentForm } from '../comments/comments.interface';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class SoupsService {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Get the specified resource
   * @param id
   */
  async getOne(id) {
    return await Soup.findOneOrFail(id, { relations: ['user'] });
  }

  /**
   * create soup
   * @param data
   */
  async create(data) {
    return await Soup.save(
      Soup.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
  }

  /**
   * update soup
   * @param id
   * @param data
   */
  async update(id, data) {
    const soup = await Soup.findOneOrFail(id);
    await Soup.merge(soup, {
      ...data,
      updatedAt: new Date(),
    }).save();

    return await this.getOne(id);
  }

  /**
   * Remove soup
   * @param id
   */
  async delete(id: number) {
    const instance = await Soup.findOneOrFail(id);
    return await instance.remove();
  }

  /**
   * list soup or search
   */
  async list(queryParam: PaginationParam) {
    const query = createQueryBuilder(Soup).leftJoinAndSelect(
      'Soup.user',
      'User',
    );

    if (queryParam.content) {
      query.andWhere('Soup.content like :content', {
        content: `%${queryParam.content}%`,
      });
    }

    if (queryParam.createdAt) {
      const createdAtQuery = queryParam.createdAt;

      if (createdAtQuery.length === 2) {
        query.andWhere(`Soup.createdAt ${createdAtQuery[0]} :createdAt`, {
          createdAt: createdAtQuery[1],
        });
      }
    }

    if (queryParam.username) {
      query.andWhere('User.name = :name', {
        name: queryParam.username,
      });
    }

    return await simplePagination(query, queryParam);
  }

  /**
   * return the star count of the soup
   */
  async starCount(soupId): Promise<number> {
    return await createQueryBuilder()
      .select()
      .from('user_soup_star', 'UserSoupStar')
      .where('UserSoupStar.soupId = :soupId', {
        soupId: soupId,
      })
      .getCount();
  }

  /**
   * determine the soup whether is stared by give user
   * @param soupId
   * @param user
   */
  async isStarByGivenUser(soupId, user: User): Promise<boolean> {
    const count = await createQueryBuilder()
      .select()
      .from('user_soup_star', 'UserSoupStar')
      .where(
        'UserSoupStar.userId = :userId AND UserSoupStar.soupId = :soupId',
        {
          userId: user.id,
          soupId: soupId,
        },
      )
      .getCount();

    return count > 0;
  }

  /**
   * star soup with request soupId and user
   * @return the star count
   */
  async star(soupId, userId): Promise<number> {
    const user = await User.findOneOrFail(userId);

    const isStar = await this.isStarByGivenUser(soupId, user);

    if (isStar) {
      throw new HttpException(
        'the resource is already star by current user',
        HttpStatus.FORBIDDEN,
      );
    }

    await createQueryBuilder()
      .insert()
      .into('user_soup_star')
      .values([
        {
          userId: user.id,
          soupId: soupId,
        },
      ])
      .execute();

    return this.starCount(soupId);
  }

  /**
   * unStar soup with request soupId and user
   * @return the star count
   */
  async unStar(soupId, userId): Promise<number> {
    const user = await User.findOneOrFail(userId);

    await createQueryBuilder()
      .delete()
      .from('user_soup_star')
      .where('userId = :userId AND soupId = :soupId', {
        userId: user.id,
        soupId: soupId,
      })
      .execute();

    return this.starCount(soupId);
  }

  /**
   * create soup comment
   * @param soupId
   * @param commentForm
   * @param user
   */
  async createComment(soupId: number, commentForm: CommentForm, user) {
    return await this.commentsService.create({
      commentForm,
      commentType: Soup.commentType,
      commentTypeId: soupId,
      user,
    });
  }

  /**
   * get soup comments
   * @param soupId
   * @param queryParam
   */
  async getComments(soupId, queryParam) {
    return await this.commentsService.getCommentsByTypeAndTypeId(
      Soup.commentType,
      soupId,
      queryParam,
    );
  }
}
