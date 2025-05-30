import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;
  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  dob: Date;

  @Column({
    nullable: true,
  })
  urlPublicAvatar: string;

  @Column({
    nullable: true,
  })
  pathAvatar: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User;
}
