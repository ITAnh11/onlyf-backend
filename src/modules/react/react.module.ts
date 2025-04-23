import { Module } from '@nestjs/common';
import { ReactService } from './react.service';
import { ReactController } from './react.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { React } from 'src/entities/react.entity';
import { Post } from 'src/entities/post.entity';
import { NotificationModule } from '../notification/notification.module';
import { UserprofileModule } from '../userprofile/userprofile.module';
@Module({
  imports: [TypeOrmModule.forFeature([React, Post]), NotificationModule, UserprofileModule], 
  controllers: [ReactController],
  providers: [ReactService],
  exports: [ReactService],
})
export class ReactModule {}
