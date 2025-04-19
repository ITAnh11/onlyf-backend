import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh_token.service';
import { RefreshTokenController } from './refresh_token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenCronService } from './refresh-token-cron.service';
import { FcmTokenModule } from '../fcm_token/fcm_token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule,
    ConfigModule.forRoot(),
    FcmTokenModule,
  ],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, RefreshTokenCronService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
