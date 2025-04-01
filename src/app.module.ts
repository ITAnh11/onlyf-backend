import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { UserProfile } from './entities/user-profile.entity';
import { UserprofileModule } from './modules/userprofile/userprofile.module';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenModule } from './modules/refresh_token/refresh_token.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PostModule } from './modules/post/post.module';
import { Post } from './entities/post.entity';
import { FriendModule } from './modules/friend/friend.module';
import { Friend } from './entities/friend.entity';
import { FriendRequest } from './entities/friend-request.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || ''),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, UserProfile, RefreshToken, Post, Friend, FriendRequest],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    UserprofileModule,
    RefreshTokenModule,
    PostModule,
    FriendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
