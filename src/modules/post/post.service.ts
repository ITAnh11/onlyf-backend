import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async getMyPosts(req: any, query: any) {
    const { cursor, limit } = query;
    const userId = req.user.userId;

    const parsedLimit = parseInt(limit, 10);
    if (!parsedLimit || parsedLimit <= 0 || parsedLimit > 50) {
      throw new HttpException('Invalid limit', HttpStatus.BAD_REQUEST);
    }

    const qb = this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id = :userId', { userId })
      .orderBy('posts.createdAt', 'DESC')
      .take(parsedLimit + 1); // Fetch one extra post to check for hasMore

    if (cursor) {
      qb.andWhere('posts.createdAt < :cursor', {
        cursor: new Date(cursor),
      });
    }

    qb.select([
      'posts.id',
      'posts.caption',
      'posts.createdAt',
      'posts.urlPublicImage',
      'user.id',
      'profile.name',
      'profile.urlPublicAvatar',
    ]);

    const posts = await qb.getMany();
    const hasMore = posts.length > limit;
    const paginatedPosts = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? paginatedPosts[limit - 1].createdAt : null;

    return {
      posts: paginatedPosts,
      hasMore,
      nextCursor,
    };
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

  async getPosts(req: any, query: any) {
    const { cursor, limit, friendId } = query;
    const userId = req.user.userId;

    const parsedLimit = parseInt(limit, 10);
    if (!parsedLimit || parsedLimit <= 0 || parsedLimit > 50) {
      throw new HttpException('Invalid limit', HttpStatus.BAD_REQUEST);
    }

    const qb = this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.friends', 'friendList')
      .leftJoin('friendList.friend', 'friend')
      .orderBy('posts.createdAt', 'DESC')
      .take(parsedLimit + 1); // Fetch one extra post to check for hasMore

    if (cursor) {
      qb.andWhere('posts.createdAt < :cursor', {
        cursor: new Date(cursor),
      });
    }

    if (friendId) {
      qb.andWhere('user.id = :friendId AND friend.id = :userId', {
        friendId,
        userId,
      });
    } else {
      qb.andWhere('friend.id = :userId', { userId }).orWhere(
        'user.id = :userId',
        { userId },
      );
    }

    qb.select([
      'posts.id',
      'posts.caption',
      'posts.createdAt',
      'posts.urlPublicImage',
      'user.id',
      'profile.name',
      'profile.urlPublicAvatar',
    ]);

    const posts = await qb.getMany();
    const hasMore = posts.length > limit;
    const paginatedPosts = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? paginatedPosts[limit - 1].createdAt : null;

    return {
      posts: paginatedPosts,
      hasMore,
      nextCursor,
    };
  }
}
