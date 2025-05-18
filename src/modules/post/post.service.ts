import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import { ReactService } from '../react/react.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FirebaseService } from '../firebase/firebase.service';
import { UserService } from '../user/user.service';
import { FriendService } from '../friend/friend.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    private readonly reactService: ReactService, // Inject ReactService

    private readonly cloudinaryService: CloudinaryService, // Inject CloudinaryService

    private readonly firebaseService: FirebaseService, // Inject FirebaseService

    private readonly userService: UserService, // Inject UserService

    private readonly friendService: FriendService, // Inject FriendService
  ) {}

  async canUploadPost(userId: number, type: string): Promise<boolean> {
    const isPremium = await this.userService.isPremium(userId);

    if (type === 'video' && !isPremium) {
      return false;
    }

    return true;
  }

  async createPost(req: any, data: any): Promise<Post> {
    
    const canUpload = await this.canUploadPost(req.user.userId, data.type);
    if (!canUpload) {
      throw new HttpException('You need to be a premium user to upload videos', HttpStatus.FORBIDDEN);
    }

    const userId = req.user.userId; // Assuming req.user contains the user object

    const newPost = this.postRepository.create({
      type: data.type,
      caption: data.caption,
      urlPublicImage: data.urlPublicImage,
      pathImage: data.pathImage,
      publicIdVideo: data.publicIdVideo,
      urlPublicVideo: data.urlPublicVideo,
      hlsUrlVideo: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,q_auto:eco/${data.publicIdVideo}.m3u8`,
      userId, // Assuming req.user contains the user object
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
      'posts',
      'user.id',
      'profile.name',
      'profile.urlPublicAvatar',
    ]);

    const posts = await qb.getMany();
    const hasMore = posts.length > limit;
    const paginatedPosts = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? paginatedPosts[limit - 1].createdAt : null;

    const serialzedPosts = paginatedPosts.map((post) => ({
      id: post.id,
      caption: post.caption,
      type: post.type,
      createdAt: post.createdAt,
      urlPublicImage: post.urlPublicImage,
      urlPublicVideo: post.urlPublicVideo,
      hlsUrlVideo: post.hlsUrlVideo,
      user: {
        id: post.user.id,
        profile: {
          name: post.user.profile.name,
          urlPublicAvatar: post.user.profile.urlPublicAvatar,
        } 
      },
      reacts: {},
    }));
    
    for (const post of serialzedPosts) {
      const reacts = await this.reactService.getReactsByPostId(post.id);
      post.reacts = reacts;
    }

    return {
      posts: serialzedPosts,
      hasMore,
      nextCursor,
    };
  }

  async deletePost(req: any, query: any) {
    const userId = req.user.userId;
    const postId = query.postId; // Assuming the post ID is passed in the request body
    const post = await this.postRepository.findOne({
      where: { id: postId, userId },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    try {
      if (post.type === 'video') {
        const publicId = post.publicIdVideo;
        await this.cloudinaryService.deleteVideo(publicId);
      } else if (post.type === 'image') {
        const pathImage = post.pathImage;
        await this.firebaseService.deleteFile(pathImage);
      }

      await this.postRepository.delete(postId);
      return { message: 'Post deleted successfully' };
    } catch (error) {
      throw new HttpException('Error deleting post', HttpStatus.INTERNAL_SERVER_ERROR);
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

    if (friendId) {
      qb.where('user.id = :friendId AND friend.id = :userId', {
        friendId,
        userId,
      });
    } else {
      qb.where('(friend.id = :userId OR user.id = :userId)', { userId });
    }

    if (cursor) {
      qb.andWhere('posts.createdAt < :cursor', {
        cursor: new Date(cursor),
      });
    }

    qb.select([
      'posts',
      'user.id',
      'profile.name',
      'profile.urlPublicAvatar',
    ]);

    const posts = await qb.getMany();
    const hasMore = posts.length > limit;
    const paginatedPosts = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? paginatedPosts[limit - 1].createdAt : null;

    const serialzedPosts = paginatedPosts.map((post) => ({
      id: post.id,
      caption: post.caption,
      type: post.type,
      createdAt: post.createdAt,
      urlPublicImage: post.urlPublicImage,
      urlPublicVideo: post.urlPublicVideo,
      hlsUrlVideo: post.hlsUrlVideo,
      user: {
        id: post.user.id,
        profile: {
          name: post.user.profile.name,
          urlPublicAvatar: post.user.profile.urlPublicAvatar,
        } 
      },
      reacts: {},
    }));
    
    for (const post of serialzedPosts) {
      const reacts = await this.reactService.getReactsByPostId(post.id);
      post.reacts = reacts;
    }

    return {
      posts: serialzedPosts,
      hasMore,
      nextCursor,
    };
  }

  async getPostById(postId: number) {
    return await this.postRepository.findOne({
      where: { id: postId },
    });
  }

  async generateShareLink(req: any, query: any) {
    const postId = query.postId; // Assuming the post ID is passed in the request body
    const ownerId = query.ownerId; // Assuming the owner ID is passed in the request body
    const post = await this.postRepository.findOne({
      where: { id: postId, userId: ownerId },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    const queryParams = new URLSearchParams({
      postId: post.id.toString(),
      ownerId: post.userId.toString(),
      createdAt: post.createdAt.toString(),
    });

    return {
      success: true,
      message: 'Share link generated successfully',
      statusCode: HttpStatus.OK,
      shareLink: `${process.env.DOMAIN_FIREBASE_HOSTING}/share/post?${queryParams.toString()}`,
    }
  } 

  async getContentPost(req: any, query: any) {
    const userId = req.user.userId;
    const postId = query.postId; // Assuming the post ID is passed in the request body
    const ownerId = query.ownerId; // Assuming the friend ID is passed in the request body

    // check is userId is a friend of ownerId
    const isFriend = await this.friendService.isFriend(
      userId,
      ownerId,
    );
    if (!isFriend) {
      throw new HttpException('You are not friends with this user', HttpStatus.FORBIDDEN);
    }
    const post = await this.postRepository.findOne({
      where: { id: postId, userId: ownerId },
      relations: ['user', 'user.profile'],
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    const serialzedPost = {
      id: post.id,
      caption: post.caption,
      type: post.type,
      createdAt: post.createdAt,
      urlPublicImage: post.urlPublicImage,
      urlPublicVideo: post.urlPublicVideo,
      hlsUrlVideo: post.hlsUrlVideo,
      user: {
        id: post.user.id,
        profile: {
          name: post.user.profile.name,
          urlPublicAvatar: post.user.profile.urlPublicAvatar,
        } 
      },
      reacts: {},
    };

    const reacts = await this.reactService.getReactsByPostId(post.id);
    serialzedPost.reacts = reacts;

    return serialzedPost;
  }
}
