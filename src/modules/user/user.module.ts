import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserprofileModule } from '../userprofile/userprofile.module';
import { CheckUniqueUserGuard } from 'src/guards/check-unique-user.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserprofileModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
