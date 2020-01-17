import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  createQueryBuilder, ManyToMany, JoinTable,
} from 'typeorm';
import { Soup } from '../soups/soup.entity';

// import { Soup } from '../Soup';
// import { UserSoupStar } from './UserSoupStar';
// import { PaginationParam, simplePagination } from '../common/pagination';
// import { Comment } from './Comment';
// import { UserCommentStar } from './UserCommentStar';

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

  @ManyToMany(type => Soup, soup => soup.starUsers)
  @JoinTable()
  starSoups: Soup[];

  //
  // @OneToMany(type => Comment, comment => comment.user)
  // comments: Comment[];
  //
  // /**
  //  * get the soups of user already star
  //  */
  // public starSoups(paginationParam: PaginationParam) {
  //   const query = createQueryBuilder(Soup)
  //     .leftJoinAndSelect('Soup.user', 'User')
  //     .innerJoinAndSelect(
  //       UserSoupStar,
  //       'UserSoupStar',
  //       'UserSoupStar.soupId = Soup.id',
  //     )
  //     .where('UserSoupStar.userId = :userId', { userId: this.id });
  //
  //   return simplePagination(query, paginationParam);
  // }
  //
  // /**
  //  * get comments of specified user stared
  //  * @param paginationParam
  //  */
  // public starComments(paginationParam: PaginationParam) {
  //   const query = createQueryBuilder(Comment)
  //     .leftJoinAndSelect('Comment.user', 'User')
  //     .innerJoinAndSelect(
  //       UserCommentStar,
  //       'UserCommentStar',
  //       'UserCommentStar.commentId = Comment.id',
  //     )
  //     .where('UserCommentStar.userId = :userId', { userId: this.id });
  //
  //   return simplePagination(query, paginationParam);
  // }
}
