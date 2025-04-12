import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { RefreshToken } from './refresh-token.entity';
import { Post } from './post.entity';
import { Friend } from './friend.entity';
import { FriendRequest } from './friend-request.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  @Index({ fulltext: true })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: string;

  @Column({
    default: false,
  })
  isActivated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  sentRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedRequests: FriendRequest[];

  @OneToMany(() => Friend, (friend) => friend.user)
  friends: Friend[];

  @OneToMany(() => Friend, (friend) => friend.friend)
  friendOf: Friend[];
}
