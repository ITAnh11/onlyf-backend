import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity()
export class React {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    nullable: false,
  })
  @Index()
  postId: number;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reacts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => Post, (post) => post.reacts)
  @JoinColumn({ name: 'postId' })
  post: Post;

}
