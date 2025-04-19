import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { FCMToken } from './fcm-token.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  refreshToken: string;

  @Column({
    type: 'timestamp',
  })
  expireAt: Date;

  @Column({
    type: 'timestamp',
  })
  createdAt: Date;

  @Column({
    nullable: true,
  })
  deviceName: string;

  @Column({
    nullable: true,
  })
  userAgent: string;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  @JoinColumn()
  user: User;

  @OneToOne(() => FCMToken, (fcmToken) => fcmToken.refreshToken, {
    cascade: true,
  })
  fcmToken: string;
}
