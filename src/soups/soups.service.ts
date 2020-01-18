import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Soup } from './soup.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PaginationParam, simplePagination } from '../common/pagination';
import { createQueryBuilder } from 'typeorm';
import { User } from '../users/user.entity';
import { CommentForm } from '../comments/comments.interface';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class SoupsService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly commentsService: CommentsService,
  ) {}

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
        user: this.request.user,
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
  async list() {
    const queryParam: PaginationParam = this.request.query;
    console.log('query=', queryParam);

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
   * star soup with request soupId and user
   * @return the star count
   */
  async star(): Promise<number> {
    const soupId = this.request.params.id;

    // @ts-ignore
    const userId = this.request.user.id;

    const soup = await Soup.findOneOrFail(soupId);
    const user = await User.findOneOrFail(userId);

    const isStar = await soup.isStarByGivenUser(user);

    if (isStar) {
      throw new HttpException(
        'the resource is already star by current user',
        HttpStatus.FORBIDDEN,
      );
    }

    await soup.star(user);
    return soup.starCount();
  }

  /**
   * unStar soup with request soupId and user
   * @return the star count
   */
  async unStar(): Promise<number> {
    const soupId = this.request.params.id;

    // @ts-ignore
    const userId = this.request.user.id;

    const soup = await Soup.findOneOrFail(soupId);
    const user = await User.findOneOrFail(userId);

    await soup.unStar(user);
    return soup.starCount();
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
}
