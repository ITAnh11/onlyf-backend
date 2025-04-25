import { Injectable } from '@nestjs/common';
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
}
