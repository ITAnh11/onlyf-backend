import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { NotificationProcessor } from './notification.processor';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { FCMToken } from 'src/entities/fcm-token.entity';

@Module({
  imports: [FirebaseModule, BullModule.registerQueue({
    name: 'notification',
  }),
  TypeOrmModule.forFeature([Notification, FCMToken]), // Add your entities here
],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationProcessor],
  exports: [NotificationService],
})
export class NotificationModule {}
