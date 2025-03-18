import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { CheckUniqueUserGuard } from 'src/guards/check-unique-user.guard';
import { UserprofileModule } from '../userprofile/userprofile.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/passports/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from 'src/passports/jwt.strategy';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    UserprofileModule,
    RefreshTokenModule,
    PassportModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CheckUniqueUserGuard,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
