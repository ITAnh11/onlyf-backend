import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private firebaseConfig: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  private readonly bucket: any;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(this.firebaseConfig),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    this.bucket = admin.storage().bucket();
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await this.bucket.file(filePath).delete();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Error deleting file from Firebase Storage');
    }
  }

  async sendFCM(
    deviceToken: string,
    title: string,
    body: string,
    data?: Record<string, any>, // nhận bất kỳ kiểu gì
  ): Promise<void> {
    try {
      console.log('Body:', body);
      console.log('Raw data:', data);

      const message = {
        token: deviceToken,
        notification: {
          title,
          body,
        },
        data, // Đảm bảo `data` chỉ chứa chuỗi
      };
  
      await admin.messaging().send(message);
    } catch (error) {
      console.error('Error sending FCM:', error);
      throw new Error('Error sending FCM');
    }
  }

}
