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

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
