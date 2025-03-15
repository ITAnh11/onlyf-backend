import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { CheckUniqueUserGuard } from 'src/guards/check-unique-user.guard';
import { UserprofileModule } from '../userprofile/userprofile.module';

@Module({
  imports: [UserModule, UserprofileModule],
  controllers: [AuthController],
  providers: [AuthService, CheckUniqueUserGuard],
})
export class AuthModule {}
