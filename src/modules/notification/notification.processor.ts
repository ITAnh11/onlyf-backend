import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { FirebaseService } from '../firebase/firebase.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';

@Processor('notification')
export class NotificationProcessor {

constructor(
    private readonly firebaseService: FirebaseService,
) {}

  @Process('send-fcm')
  async handleSendFCM(job: Job) {
    const { deviceToken, title, body, data} = job.data;

    try {
      await this.firebaseService.sendFCM(deviceToken, title, body, data);

    } catch (error) {
      console.error('Error sending FCM:', error);

      // Retry job sau 1 phút
      if (job.attemptsMade < 3) {
        throw error; // Bull sẽ retry tự động
      }
    }
    
    
    console.log('✅ FCM sent to', deviceToken);
  }
}
  