import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { ReactModule } from '../react/react.module';
import { FirebaseService } from '../firebase/firebase.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), ReactModule, FirebaseService, CloudinaryService],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
