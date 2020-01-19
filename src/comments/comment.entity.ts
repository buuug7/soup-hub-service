import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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
  @ManyToOne(type => User, user => user.comments)
  user: User;

  // the comment that this comment reply
  @ManyToOne(type => Comment, comment => comment.replyComments)
  targetComment: Comment;

  // the comments that reply this comment
  @OneToMany(type => Comment, comment => comment.targetComment)
  replyComments: Comment[];

  @ManyToMany(type => User, user => user.starComments)
  starUsers: User[];
}
