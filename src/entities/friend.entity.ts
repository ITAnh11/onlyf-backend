import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['user', 'friend'])
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.friends)
  user: User;

  @ManyToOne(() => User, (user) => user.friendOf)
  friend: User;

  @Column({
    default: false,
  })
  isBlocked: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
