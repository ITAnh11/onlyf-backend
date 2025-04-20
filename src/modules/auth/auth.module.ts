import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserprofileModule } from '../userprofile/userprofile.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/passports/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from 'src/passports/jwt.strategy';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { RedisModule } from '../redis/redis.module';
import { OTPService } from './otp.service';

@Module({
  imports: [
    UserModule,
    UserprofileModule,
    RefreshTokenModule,
    PassportModule,
    JwtModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OTPService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService, OTPService],
})
export class AuthModule {}
