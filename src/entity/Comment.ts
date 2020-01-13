import {
  BaseEntity,
  Column,
  createQueryBuilder,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { UserCommentStar } from './UserCommentStar';
import { PaginationParam, simplePagination } from '../common/pagination';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  commentableType: string; // the comment belong to which type of resource

  @Column()
  commentableId: number; // the resource id for comment

  @ManyToOne(type => User, user => user.comments)
  user: number; // create user

  @ManyToOne(type => Comment, {
    nullable: true,
  })
  targetComment: number; // other comment if reply other comment

  @Column()
  createdAt: Date;

  /**
   * reply the comment
   * @param content
   * @param user
   */
  async reply({ content, user }) {
    const comment = Comment.create({
      content,
      user,
      commentableType: this.commentableType,
      commentableId: this.commentableId,
      targetComment: this.id,
      createdAt: new Date(),
    });
    await comment.save();
    return comment;
  }

  /**
   * determine the comment is star by given user
   * @param user
   */
  async isStarByGivenUser(user: User): Promise<boolean> {
    const count = await createQueryBuilder(UserCommentStar, 'UserCommentStar')
      .where(
        'UserCommentStar.userId = :userId AND UserCommentStar.commentId = :commentId',
        {
          userId: user.id,
          commentId: this.id,
        },
      )
      .getCount();

    return count > 0;
  }

  /**
   * star the comment with given user
   * @param user
   */
  async star(user: User) {
    return createQueryBuilder()
      .insert()
      .into(UserCommentStar)
      .values([
        {
          userId: user.id,
          commentId: this.id,
          createdAt: new Date(),
        },
      ])
      .execute();
  }

  async unStar(user: User) {
    const userCommentStar = await UserCommentStar.findOneOrFail({
      userId: user.id,
      commentId: this.id,
    });

    return userCommentStar.remove();
  }

  /**
   * get the star count number of the comment
   */
  async starCount() {
    return await createQueryBuilder(UserCommentStar, 'UserCommentStar')
      .where('UserCommentStar.commentId = :commentId', {
        commentId: this.id,
      })
      .getCount();
  }

  async starUsers(paginationParam: PaginationParam) {
    const query = createQueryBuilder(User)
      .innerJoinAndSelect(
        UserCommentStar,
        'UserCommentStar',
        'UserCommentStar.userId = User.id',
      )
      .where('UserCommentStar.commentId = :commentId', {
        commentId: this.id,
      });

    return simplePagination(query, paginationParam);
  }
}
