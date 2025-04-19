import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications) // Người nhận thông báo
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  sender: number; // nguoi gay ra thông báo

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ type: 'json', nullable: true }) // chứa id bài viết, tin nhắn, ...
  data: any;

  @CreateDateColumn()
  createdAt: Date;
}