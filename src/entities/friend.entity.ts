import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['user', 'friend'])
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  friendId: number;

  @Column({
    default: false,
  })
  isBlocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.friends)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, (user) => user.friendOf)
  @JoinColumn({ name: 'friendId' })
  friend: User;

}
