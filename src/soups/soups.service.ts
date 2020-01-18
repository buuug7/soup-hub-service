import { Inject, Injectable } from '@nestjs/common';
import { Soup } from './soup.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PaginationParam, simplePagination } from '../common/pagination';
import { createQueryBuilder } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class SoupsService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

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
}
