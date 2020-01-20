import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({
  orderBy: {
    id: 'DESC',
  },
})
export class Soup extends BaseEntity {
  static readonly commentType = 'SOUP';

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    nullable: true,
    type: 'json',
  })
  more: object;

  @Column({
    default: false,
  })
  active: boolean;

  @Column({
    nullable: true,
  })
  createdAt: Date;

  @Column({
    nullable: true,
  })
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  deletedAt: Date;

  @ManyToOne(type => User, user => user.soups, {
    eager: false,
  })
  user: User;

  @ManyToMany(type => User, user => user.starSoups, {
    cascade: true,
  })
  starUsers: User[];
}
