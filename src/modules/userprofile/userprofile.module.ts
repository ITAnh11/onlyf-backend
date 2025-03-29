import { Module } from '@nestjs/common';
import { UserprofileService } from './userprofile.service';
import { UserprofileController } from './userprofile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from 'src/entities/user-profile.entity';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile]), FirebaseModule],
  providers: [UserprofileService],
  controllers: [UserprofileController],
  exports: [UserprofileService],
})
export class UserprofileModule {}
