import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';

import { UserprofileService } from '../userprofile/userprofile.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,

        private readonly notificationService: NotificationService,

        private readonly userProfileService: UserprofileService,
    ) {}

    async replyToPost(req: any) {
        const userId = req.user.userId; // Assuming you have userId in the request object

        const userprofile = await this.userProfileService.getProfile({user: {userId}});

        const { receiverId, postId, text } = req.body;

        const message = this.messageRepository.create({
            senderId: userId,
            receiverId: receiverId,
            postId: postId,
            text: text,
            type: 'text',
            status: 'sent',
        });

        const savedMessage = await this.messageRepository.save(message);

        this.notificationService.notifyUserFCM(
            receiverId,
            'New reply to your post',
            `You have a new reply to your post from ${userprofile?.name}`,
            {
                senderId: userId.toString(),
                senderName: userprofile?.name,
                senderAvatar: userprofile?.urlPublicAvatar,
                postId: postId.toString(),
                messageId: savedMessage.id.toString(),
                messageText: text,
            },
            userId,
        )

        return savedMessage;
    }

    async saveMessage(data: any) {
        const { senderId, receiverId, text, type, mediaUrl, createdAt } = data;

        const message = this.messageRepository.create({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            type: type,
            mediaUrl: mediaUrl,
            status: 'sent',
            
        });

        return await this.messageRepository.save(message);
    }

    async updateIsReadMessage(userId: number, senderId: number) {
      await this.messageRepository
        .createQueryBuilder('message')
        .update()
        .set({ status: 'read' })
        .where('"message"."receiverId" = :receiverId', { receiverId: userId }) // Bao tên cột trong dấu ngoặc kép
        .andWhere('"message"."senderId" = :senderId', { senderId })
        .andWhere('"message"."status" = :status', { status: 'sent' })
        .execute();
    }

    async getMessages(req: any, query: any) {
        const { cursor, limit, friendId } = query;
        const userId = req.user.userId;
    
        const parsedLimit = parseInt(limit, 10);
        if (!parsedLimit || parsedLimit <= 0 || parsedLimit > 50) {
            throw new HttpException('Invalid limit', HttpStatus.BAD_REQUEST);
        }

        const qb = this.messageRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.post', 'post')
            .where('((message.senderId = :userId AND message.receiverId = :friendId) OR (message.senderId = :friendId AND message.receiverId = :userId ))', {userId, friendId} )
            .orderBy('message.createdAt', 'DESC')
            .limit(parsedLimit + 1);

        if (cursor) {
            qb.andWhere('message.createdAt < :cursor', {
                cursor: new Date(cursor),
            });
        }

        const messages = await qb.getMany();
        const hasMore = messages.length > parsedLimit;
        const paginatedMessages = hasMore ? messages.slice(0, parsedLimit) : messages;
        const nextCursor = hasMore ? paginatedMessages[parsedLimit - 1].createdAt : null;

        return {
            messages: paginatedMessages,
            hasMore,
            nextCursor,
        };
    }
}