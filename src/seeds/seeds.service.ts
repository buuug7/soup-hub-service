import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { createQueryBuilder } from 'typeorm';
import { hashSync } from 'bcrypt';
import * as faker from 'faker';
import { Soup } from '../soups/soup.entity';

@Injectable()
export class SeedsService {
  async seedUsers() {
    const users = [
      {
        name: 'Buuug7',
        email: 'youpp@126.com',
        password: hashSync('111111', 3),
        createdAt: new Date(),
      },
      {
        name: 'Tom',
        email: 'tom@gmail.com',
        password: hashSync('111111', 3),
        createdAt: new Date(),
      },
    ].concat(SeedsService.generateUser(8));

    return createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute();
  }

  static generateUser(num) {
    const users = [];
    for (let i = 0; i < num; i++) {
      users.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: hashSync(faker.random.word(), 3),
        createdAt: faker.date.past(),
      });
    }
    return users;
  }

  async seedSoups() {
    return createQueryBuilder()
      .insert()
      .into(Soup)
      .values(SeedsService.generateSoups(5))
      .execute();
  }

  static generateSoups(num) {
    const soups = [];
    for (let i = 0; i < num; i++) {
      soups.push({
        content: faker.lorem.paragraphs(),
        more: {},
        createdAt: faker.date.past(),
      });
    }

    return soups;
  }
}
