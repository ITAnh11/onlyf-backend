import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications) // Người nhận thông báo
  user: User;

  @ManyToOne(() => User, { nullable: true }) // Người gây ra hành động (like, kb, nhắn tin)
  sender: User;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ type: 'json', nullable: true }) // chứa id bài viết, tin nhắn, ...
  data: any;

  @Column({ default: 'pending' }) // 'sent', 'failed'
  status: string;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}