import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { createQueryBuilder, getConnection } from 'typeorm';
import { hashSync } from 'bcrypt';
import * as faker from 'faker';
import { Soup } from '../soups/soup.entity';
import * as dayjs from 'dayjs';

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
    const rs = await createQueryBuilder()
      .insert()
      .into(Soup)
      .values(SeedsService.generateSoups(5))
      .execute();

    console.log('rs=', rs);

    const ids = rs.identifiers.map(item => item.id);

    return ids;
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

  async seeds() {
    const fakeDate = () =>
      dayjs(faker.date.past()).format('YYYY-MM-DD HH:mm:ss');

    let query = `insert into soup(content, more, createdAt, userId) values `;

    query += `('${faker.lorem.paragraphs()}', '{}', '${fakeDate()}', 1),`;
    query += `('${faker.lorem.paragraphs()}', '{}', '${fakeDate()}', 1),`;
    query += `('${faker.lorem.paragraphs()}', '{}', '${fakeDate()}', 1),`;
    query += `('${faker.lorem.paragraphs()}', '{}', '${fakeDate()}', 1),`;
    query += `('${faker.lorem.paragraphs()}', '{}', '${fakeDate()}', 1),`;
    query += `('${faker.lorem.paragraphs()}', '{}', '${fakeDate()}', 1),`;
    query += `('${faker.lorem.paragraphs()}', '{}', '${fakeDate()}', 1)`;

    console.log('query=', query);

    return await getConnection().query(query);
  }
}
