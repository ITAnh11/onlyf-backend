import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { RefreshToken } from './refresh-token.entity';

@Entity()
export class FCMToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.fcmTokens) // Người nhận thông báo
  @JoinColumn()
  user: User;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.fcmToken)
  @JoinColumn()
  refreshToken: RefreshToken;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}