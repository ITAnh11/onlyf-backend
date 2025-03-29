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
}
