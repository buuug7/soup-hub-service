import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { hashSync } from 'bcrypt';
import { UserCreate } from './users.interface';

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
}
