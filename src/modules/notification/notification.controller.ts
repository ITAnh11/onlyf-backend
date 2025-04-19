import { Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FirebaseService } from '../firebase/firebase.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService,

    private readonly firebaseService: FirebaseService,
  ) {
  }

  @Post('test')
  async testNotification() {
    this.notificationService.notifyUserFCM(
      1,
      'Test Notification',
      'This is a test notification',
      { key: 'value' },
      1,
    );
    return { message: 'Notification sent' };
  }
}
