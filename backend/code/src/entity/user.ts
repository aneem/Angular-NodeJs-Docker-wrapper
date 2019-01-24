import { Entity, Column, OneToMany } from 'typeorm';
import { XBaseEntity } from './xBaseEntity';
import { Exclude } from 'class-transformer';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Meal } from './meal';

@Entity()
export class User extends XBaseEntity {
  @ApiModelProperty()
  @Column()
  firstName: string;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  middleName: string;

  @ApiModelProperty()
  @Column()
  lastName: string;

  @ApiModelProperty()
  @Column()
  userName: string;

  @ApiModelProperty()
  @Column()
  email: string;

  @Exclude()
  @ApiModelProperty()
  @Column()
  password: string;

  @OneToMany(type => Meal, meals => meals.user)
  meals: Meal[];

  // @ApiModelProperty()
  @Column({ default: 'user', nullable: false })
  role: string;

  // @Column({nullable: false })
  // gender: string;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  contactNumber: string;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  address: string;

  @Column({ default: 0, nullable: false })
  noOfDailyCalories: number;
}
