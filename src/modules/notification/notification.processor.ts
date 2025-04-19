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

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
) {}

  @Process('send-fcm')
  async handleSendFCM(job: Job, userId: number) {
    const { deviceToken, title, body, data } = job.data;

    try {
      await this.firebaseService.sendFCM(deviceToken, title, body, data);

      // Lưu vào DB nếu gửi thành công
      await this.notificationRepository.save({
        user: { id: userId }, // Assuming you have the user ID
        title,
        body,
        data,
        status: 'sent',
      });

    } catch (error) {
      console.error('Error sending FCM:', error);
      

      // Retry job sau 1 phút
      if (job.attemptsMade < 3) {
        throw error; // Bull sẽ retry tự động
      }

      // Lưu lỗi vào DB nếu retry hết
      await this.notificationRepository.save({
        title,
        body,
        userId,
        status: 'failed',
        errorMessage: error.message,
      });
    }
    
    
    console.log('✅ FCM sent to', deviceToken);
  }
}
  