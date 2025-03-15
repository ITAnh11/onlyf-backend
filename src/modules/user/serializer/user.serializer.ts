import { Exclude } from 'class-transformer';

export class UserSerializer {
  @Exclude()
  password: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  refreshToken: string;

  constructor(partial: Partial<UserSerializer>) {
    Object.assign(this, partial);
  }
}
