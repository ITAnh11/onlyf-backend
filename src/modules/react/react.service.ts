import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { React } from 'src/entities/react.entity';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { Post } from 'src/entities/post.entity';

@Injectable()
export class ReactService {
    constructor(
        @InjectRepository(React)
        private readonly reactRepository: Repository<React>,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        private readonly notificationService: NotificationService,
    ) {}s

    async createReact(req: any) {
        const user = req.user;
        const userId = user.userId;

        const { postId, type } = req.body;

        const post = await this.postRepository.findOne({ where: { id: postId } });
        if (!post) {
            throw new HttpException('Post not found', 404);
        }

        if (!postId || !type) {
            throw new HttpException('Post ID and type are required', 400);
        }
        const react = this.reactRepository.create({
            userId,
            postId,
            type,
        });

        this.notificationService.notifyUserFCM(
            post.userId,
            'New React',
            `${user.name} reacted to your post`,
            {
                postId: post.id,
                type: react.type,
            },
            userId,
        );

        return await this.reactRepository.save(react);
    }

    async getReactsByPostId(postId: number) {
        const rawResults = await this.reactRepository.createQueryBuilder('react')
        .where('react.postId = :postId', { postId })
        .select(['react.type', 'COUNT(react.type) as count'])
        .groupBy('react.type')
        .orderBy('count', 'DESC')
        .getRawMany();

        // Chuyển giá trị count từ string sang number
        return rawResults.map(result => ({
            type: result.react_type,
            count: Number(result.count), // Hoặc parseInt(result.count, 10)
        }));
        }
}
