import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stat } from 'fs';
import { Post } from 'src/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(req: any, data: any): Promise<Post> {
    const userId = req.user.userId; // Assuming req.user contains the user object
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
    const userId = req.user.userId; // Assuming req.user contains the user object
    try {
      return await this.postRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new Error('Error fetching posts: ' + error.message);
    }
  }

  async deletePost(req: any, query: any) {
    const userId = req.user.userId;
    const postId = query.postId; // Assuming the post ID is passed in the request body
    try {
      const result = await this.postRepository.delete({
        id: postId,
        user: { id: userId }, // Sử dụng điều kiện đơn giản
      });

      if (result.affected === 0) {
        throw new Error(
          'Post not found or you do not have permission to delete it.',
        );
      }

      return {
        message: 'Post deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new Error('Error deleting post: ' + error.message);
    }
  }
}
