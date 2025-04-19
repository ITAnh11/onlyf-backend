import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { FCMToken } from 'src/entities/fcm-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
    constructor(
        @InjectQueue('notification') private notificationQueue: Queue,

        @InjectRepository(FCMToken)
        private readonly fcmTokenRepository: Repository<FCMToken>,
      ) {}
    
      async notifyUserFCM(userId: number, title: string, body: string, data = {}) {
        const deviceTokens = await this.fcmTokenRepository.find({
          where: {
            user: { id: userId },
          },
        });
        if (deviceTokens.length === 0) {
          console.log('No device tokens found for user:', userId);
          return;
        }
        for (const token of deviceTokens) {
          const deviceToken = token.token;
          this.notificationQueue.add('sendNotification', {
            deviceToken,
            title,
            body,
            data,
          }, {
            attempts: 3, // Retry 3 times if the job fails
            backoff: 60000, // Wait 60 seconds before retrying
          });
      }
    }
}
