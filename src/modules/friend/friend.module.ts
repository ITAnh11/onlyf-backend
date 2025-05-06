import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/entities/friend.entity';
import { FriendRequest } from 'src/entities/friend-request.entity';
import { UserprofileModule } from '../userprofile/userprofile.module';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend, FriendRequest]),
    UserModule,
    UserprofileModule,
    NotificationModule,
    UserModule,
  ],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
