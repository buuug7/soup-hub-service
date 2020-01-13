import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * pivot table used for store user star comment
 */

@Entity()
export class UserCommentStar extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  commentId: number;

  @Column()
  createdAt: Date;
}
