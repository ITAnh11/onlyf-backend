import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(req: any, data: any): Promise<Post> {
    const userId = req.user.id; // Assuming req.user contains the user object
    const newPost = this.postRepository.create({
      caption: data.caption,
      urlPublicImage: data.urlPublicImage,
      pathImage: data.pathImage,
      user: { id: userId }, // Assuming req.user contains the user object
    });
    try {
      return await this.postRepository.save(newPost);
    } catch (error) {
      throw new Error('Error creating post: ' + error.message);
    }
  }

  async getMyPosts(req: any): Promise<Post[]> {
    const userId = req.user.id; // Assuming req.user contains the user object
    try {
      return await this.postRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new Error('Error fetching posts: ' + error.message);
    }
  }
}
