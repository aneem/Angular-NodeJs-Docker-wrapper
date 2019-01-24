import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  BaseEntity,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class XBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Exclude()
  @CreateDateColumn({ select: false })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @Exclude()
  @Column({ nullable: true, select: false })
  deletedAt: Date;

  @VersionColumn() version: number;

  async remove() {
    this.deletedAt = new Date();
    return this.save();
  }

  constructor(partial: Partial<BaseEntity>) {
    super();
    Object.assign(this, partial);
  }
}
