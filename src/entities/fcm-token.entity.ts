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

  @Column()
  userId: number;

  @Column({
    unique: true,
  })
  refreshTokenId: number;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.fcmTokens) // Người nhận thông báo
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.fcmToken)
  @JoinColumn({ name: 'refreshTokenId' })
  refreshToken: RefreshToken;
}