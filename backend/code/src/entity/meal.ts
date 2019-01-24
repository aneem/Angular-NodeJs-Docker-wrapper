import { Entity, Column, ManyToOne } from 'typeorm';
import { XBaseEntity } from './xBaseEntity';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { User } from './user';

@Entity()
export class Meal extends XBaseEntity {
  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelPropertyOptional()
  @Column({ nullable: true, length: 500 })
  description: string;

  @ApiModelProperty()
  @Column()
  calories: number;

  @ApiModelProperty()
  @Column()
  mealDateTime: Date;

  @ApiModelProperty()
  @Column()
  category: string;

  @ApiModelProperty()
  @ManyToOne(type => User, user => user.meals)
  user: User;
}
