import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { DataSource, Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';

import { UserprofileService } from '../userprofile/userprofile.service';
import { Friend } from 'src/entities/friend.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,

        private readonly notificationService: NotificationService,

        private readonly userProfileService: UserprofileService,

        @InjectRepository(Friend)
        private readonly friendRepository: Repository<Friend>,

        private dataSource: DataSource
    ) {}

    async replyToPost(req: any) {
        const userId = req.user.userId; // Assuming you have userId in the request object

        const userprofile = await this.userProfileService.getProfileByUserId(userId);

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
            'New reply',
            `${userprofile?.name}: ${text}`,
            {
                senderId: userId.toString(),
                senderName: userprofile?.name,
                senderAvatar: userprofile?.urlPublicAvatar,
                senderUsername: userprofile?.username,
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
        const formattedMessages = paginatedMessages.map((message) => {
            return {
                id: message.id,
                senderId: message.senderId,
                receiverId: message.receiverId,
                message: {
                    text: message.text,
                    type: message.type,
                    mediaUrl: message.mediaUrl,
                    status: message.status,
                    createdAt: message.createdAt,
                    updatedAt: message.updatedAt,
                },
                postId: message.postId,
                post: message.post
            };
        });

        return {
            messages: formattedMessages,
            hasMore,
            nextCursor,
        };
    }

    async getLastMessageOfAllChats(req: any) {
        const userId = req.user.userId;
        try {
            const latestMessages = await this.messageRepository
            .createQueryBuilder('message')
            .distinctOn([
                'LEAST(message.senderId, message.receiverId)',
                'GREATEST(message.senderId, message.receiverId)',
            ])
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .leftJoinAndSelect('message.post', 'post')
            .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
            .orderBy('LEAST(message.senderId, message.receiverId)', 'ASC')
            .addOrderBy('GREATEST(message.senderId, message.receiverId)', 'ASC')
            .addOrderBy('message.createdAt', 'DESC')
            .getMany();

            const formattedMessages = latestMessages.map((message) => ({
            id: message.id,
            friendId: message.senderId === userId ? message.receiverId : message.senderId,
            senderId: message.senderId,
            receiverId: message.receiverId,
            message: {
                text: message.text,
                type: message.type,
                mediaUrl: message.mediaUrl,
                status: message.status,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
            },
            postId: message.postId,
            post: message.post
            }));

            return formattedMessages;
        } catch (error) {
            console.error('Error fetching last messages:', error);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getLastMessageOfAllChatsV2(req: any) {
  const userId = req.user.userId;
  try {
    const result = await this.dataSource.query(
      `
      WITH latest_messages AS (
        SELECT DISTINCT ON (
            LEAST(m."senderId", m."receiverId"),
            GREATEST(m."senderId", m."receiverId")
        )
            m.*
        FROM message m
        ORDER BY
            LEAST(m."senderId", m."receiverId") ASC,
            GREATEST(m."senderId", m."receiverId") ASC,
            m."createdAt" DESC
        )
        SELECT
        f.id as friend_id,
        f."userId" as friend_userId,
        f."friendId" as friend_friendId,
        lm.id as message_id,
        lm."senderId" as message_senderId,
        lm."receiverId" as message_receiverId,
        lm.text as message_text,
        lm.type as message_type,
        lm."mediaUrl" as message_mediaUrl,
        lm.status as message_status,
        lm."createdAt" as message_createdAt,
        lm."updatedAt" as message_updatedAt,
        lm."postId" as message_postId,
        p.*
        FROM "friend" f
        JOIN "user" u ON u.id = f."friendId"
        LEFT JOIN latest_messages lm ON (
        (f."userId" = lm."senderId" AND f."friendId" = lm."receiverId")
        OR
        (f."userId" = lm."receiverId" AND f."friendId" = lm."senderId")
        )
        LEFT JOIN post p ON p.id = lm."postId"
        WHERE f."userId" = $1
        ORDER BY COALESCE(lm."createdAt", '1970-01-01') DESC;
      `,
      [userId]
    );

    return result;
  } catch (error) {
    console.error('Error fetching last messages with friends:', error);
    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

}