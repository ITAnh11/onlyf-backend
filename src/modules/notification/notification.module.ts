import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { NotificationProcessor } from './notification.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { FCMToken } from 'src/entities/fcm-token.entity';
import { User } from 'src/entities/user.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    FirebaseModule, 
    TypeOrmModule.forFeature([Notification, FCMToken, User]),
    FirebaseModule,
   // Add your entities here
],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationProcessor],
  exports: [NotificationService],
})
export class NotificationModule {}
