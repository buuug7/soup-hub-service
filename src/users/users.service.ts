import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

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
}
