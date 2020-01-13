import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { Soup } from './Soup';

/**
 * pivot table used for store user star soup
 */

@Entity()
export class UserSoupStar extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  soupId: number;

  @Column()
  createdAt!: Date;

  soup: Soup;
}
