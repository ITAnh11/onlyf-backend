import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { NotificationModule } from '../notification/notification.module';
import { UserprofileModule } from '../userprofile/userprofile.module';
import { Friend } from 'src/entities/friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Friend]), NotificationModule, UserprofileModule], // Add your entities here
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
