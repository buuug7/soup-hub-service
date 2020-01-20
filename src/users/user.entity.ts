import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Soup } from '../soups/soup.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    nullable: true,
    select: false,
  })
  rememberToken: string;

  @Column({
    nullable: true,
    select: false,
  })
  github: string;

  @Column({
    nullable: true,
  })
  createdAt: Date;

  @Column({
    nullable: true,
  })
  updatedAt: Date;

  @OneToMany(type => Soup, soup => soup.user)
  soups: Soup[];

  @OneToMany(type => Comment, comment => comment.user)
  comments: Comment[];

  @ManyToMany(type => Soup, soup => soup.starUsers)
  @JoinTable({
    name: 'user_soup_star',
  })
  starSoups: Soup[];

  @ManyToMany(type => Comment, comment => comment.starUsers)
  @JoinTable({
    name: 'user_comment_star',
  })
  starComments: Comment[];
}
