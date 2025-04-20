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
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { RedisModule } from './modules/redis/redis.module';
import { NotificationModule } from './modules/notification/notification.module';
import { Notification } from './entities/notification.entity';
import { FCMToken } from './entities/fcm-token.entity';
import { FcmTokenModule } from './modules/fcm_token/fcm_token.module';
import { Message } from './entities/message.entity';
import { ChatGateway } from './modules/chat/chat.gateway';
import { ChatModule } from './modules/chat/chat.module';
import { JwtModule } from '@nestjs/jwt';

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
      ssl:
        process.env.DATABASE_SSL === 'true'
          ? {
              rejectUnauthorized: false,
            }
          : false,
      entities: [User, UserProfile, RefreshToken, Post, Friend, FriendRequest, Notification, FCMToken, Message],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT || ''),
        secure: process.env.MAIL_SECURE === 'true',
        // ignoreTLS: true,
        // secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
      // preview: true,
      template: {
        dir: join(__dirname, 'mail/templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
   
    }),
    JwtModule,
    RedisModule,
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    UserprofileModule,
    RefreshTokenModule,
    PostModule,
    FriendModule,
    NotificationModule,
    FcmTokenModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
