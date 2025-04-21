import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';
import { React } from './react.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    nullable: true,
  })
  caption: string;

  @Column({
    nullable: true,
  })
  urlPublicImage: string;

  @Column({
    nullable: true,
  })
  pathImage: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Message, (message) => message.post, {
    onDelete: 'CASCADE',
  })
  replys: Message[];

  @ManyToMany(() => React, (react) => react.post, {
    onDelete: 'CASCADE',
  })
  reacts: React[];
}
