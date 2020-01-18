import {
  BaseEntity,
  Column,
  createQueryBuilder,
  Entity,
  getManager,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { User } from './User';
// import { UserSoupStar } from './UserSoupStar';
// import { Comment } from './Comment';
import { PaginationParam, simplePagination } from '../common/pagination';
import { User } from '../users/user.entity';

@Entity({
  orderBy: {
    id: 'DESC',
  },
})
export class Soup extends BaseEntity {
  static readonly commentableType = 'SOUP';

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

  @ManyToMany(type => User, user => user.starSoups)
  starUsers: User;

  /**
   * star the soup with given user
   * @param user
   */
  // public star(user: User) {
  //   return createQueryBuilder()
  //     .insert()
  //     .into(UserSoupStar)
  //     .values([
  //       {
  //         userId: user.id,
  //         soupId: this.id,
  //         createdAt: new Date(),
  //       },
  //     ])
  //     .execute();
  // }

  /**
   * unStar the soup with given user
   * @param user
   */
  // public async unStar(user: User) {
  //   const userSoupStar = await UserSoupStar.findOne({
  //     userId: user.id,
  //     soupId: this.id,
  //   });
  //
  //   if (userSoupStar) {
  //     return userSoupStar.remove();
  //   }
  // }

  /**
   * determine the soup is star by give user
   * @param user
   */
  // async isStarByGivenUser(user: User): Promise<boolean> {
  //   const count = await createQueryBuilder(UserSoupStar, 'UserSoupStar')
  //     .where(
  //       'UserSoupStar.userId = :userId AND UserSoupStar.soupId = :soupId',
  //       {
  //         userId: user.id,
  //         soupId: this.id,
  //       },
  //     )
  //     .getCount();
  //
  //   return count > 0;
  // }

  /**
   * return the star count number of the soup
   */
  // async starCount(): Promise<number> {
  //   return await createQueryBuilder(UserSoupStar, 'UserSoupStar')
  //     .where('UserSoupStar.soupId = :soupId', {
  //       soupId: this.id,
  //     })
  //     .getCount();
  // }

  /**
   * create comment on the soup
   * @param content
   * @param user
   * @param targetComment
   */

  // async createComment({ content, user, targetComment }) {
  //   const comment = Comment.create({
  //     content: content,
  //     commentableType: Soup.commentableType,
  //     commentableId: this.id,
  //     user: user,
  //     targetComment: targetComment,
  //     createdAt: new Date(),
  //   });
  //
  //   return comment.save();
  // }

  /**
   * get the soup comments
   * @param paginationParam
   */
  // async comments(paginationParam: PaginationParam) {
  //   const query = createQueryBuilder(Comment, 'Comment')
  //     .leftJoinAndSelect('Comment.user', 'user')
  //     .where('Comment.commentableType = :commentableType', {
  //       commentableType: Soup.commentableType,
  //     })
  //     .andWhere('Comment.commentableId = :commentableId', {
  //       commentableId: this.id,
  //     });
  //
  //   return simplePagination(query, paginationParam);
  // }
}
