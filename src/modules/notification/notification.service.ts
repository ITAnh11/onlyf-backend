import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { FCMToken } from 'src/entities/fcm-token.entity';
import { Notification } from 'src/entities/notification.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(FCMToken)
        private readonly fcmTokenRepository: Repository<FCMToken>,

        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly firebaseService: FirebaseService,
      ) {
      }
    
      async notifyUserFCM(userId: number, title: string, body: string, data = {}, senderId?: number) {
        const deviceTokens = await this.fcmTokenRepository.find({
          where: {
            userId,
          },
        });
        if (deviceTokens.length === 0) {
          console.log('No device tokens found for user:', userId);
          return;
        }
      
        for (const token of deviceTokens) {
            this.firebaseService.sendFCM(
              token.token,
              title,
              body,
              data,
            ).catch(async (error: any) => {
              console.error('Error sending FCM:', error);

              if (error.errorInfo?.code === 'messaging/registration-token-not-registered') {
                await this.fcmTokenRepository.delete(token.id);
                console.log('Removed invalid FCM token:', token.token);
              }
            });
          }
      
        // Save notification to database
        await this.saveNotification(userId, title, body, data, senderId);
      }

     async saveNotification(userId: number, title: string, body: string, data = {}, senderId?: number) {
        const user = await this.userRepository.findOne({ where: {id: userId} });
        if (!user) {
          console.log('User not found:', userId);
          return;
        }
        
        const notification = this.notificationRepository.create({
          user,
          title,
          body,
          data,
          senderId,
        });

        await this.notificationRepository.save(notification);

      }
}
