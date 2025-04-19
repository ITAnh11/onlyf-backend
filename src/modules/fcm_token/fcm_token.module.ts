import { Module } from '@nestjs/common';
import { FcmTokenService } from './fcm_token.service';
import { FcmTokenController } from './fcm_token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FCMToken } from 'src/entities/fcm-token.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FCMToken, RefreshToken])],
  controllers: [FcmTokenController],
  providers: [FcmTokenService],
  exports: [FcmTokenService],
})
export class FcmTokenModule {}
