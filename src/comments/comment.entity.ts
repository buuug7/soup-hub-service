import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  // the comment belong to which type of resource
  @Column()
  commentType: string;

  // the resource id for comment
  @Column()
  commentTypeId: number;

  @Column()
  createdAt: Date;

  // created user
  @ManyToOne(type => User, user => user.comments, {
    eager: true,
  })
  user: User;

  // the comment that this comment reply to
  @ManyToOne(type => Comment, comment => comment.children)
  parent: Comment;

  // the comments that reply this comment
  @OneToMany(type => Comment, comment => comment.parent)
  children: Comment[];

  @ManyToMany(type => User, user => user.starComments)
  starUsers: User[];
}
