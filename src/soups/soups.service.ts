import { Inject, Injectable } from '@nestjs/common';
import { Soup } from './soup.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

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
   * Remove the specified resource from storage
   * @param id
   */
  async delete(id: number) {
    const instance = await Soup.findOneOrFail(id);
    return await instance.remove();
  }
}
