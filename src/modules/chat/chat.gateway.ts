import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { NotificationService } from '../notification/notification.service';
import { ChatService } from './chat.service';
import { UserprofileService } from '../userprofile/userprofile.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  constructor(
    private readonly jwtService: JwtService,

    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,

    private readonly notificationService: NotificationService,
    private readonly chatService: ChatService,

    private readonly userProfileService: UserprofileService,
  ) {}
  
  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token.split(' ')[1];
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      const userId = payload.sub;
      client.data.user = payload;

      const userprofile = await this.userProfileService.getProfile({ user: { userId } });

      client.data.user = {
        ...payload,
        urlPublicAvatar: userprofile?.urlPublicAvatar,
        name: userprofile?.name,
      }

      // Store the socket ID in Redis with userId as the key
      this.redisClient.set(`user:${userId}`, client.id);

      console.log(`🔗 User ${userId} connected with socketId: ${client.id} at time ${new Date()}`);
    } catch (error) {
      client.emit('error', 'Invalid token');
      client.disconnect();
      console.error('❌ JWT verification failed:', error.message);
    }
  }
  

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      // Remove the socket ID from Redis
      this.redisClient.del(`user:${user.sub}`);
      console.log(`🔌 User ${user.sub} disconnected with socketId: ${client.id} at time ${new Date()}`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    console.log(`📩 User ${user.sub} sent a message:`, payload);

    this.notificationService.notifyUserFCM(
      payload.recipientId,
      `New message from ${user.sub}`,
      `You have a new message from ${user.sub}`,
      {
        senderId: user.sub.toString(),
        senderName: user.name,
        senderAvatar: user.urlPublicAvatar,
        messageText: payload.message.text? payload.message.text : `New message`,
    },
      user.sub, 
    );

    this.chatService.saveMessage({
      senderId: user.sub,
      receiverId: payload.recipientId,
      text: payload.message.text,
      type: payload.message.type,
      mediaUrl: payload.mediaUrl,
      createdAt: payload.message.createdAt,
    });

    const recipientId = payload.recipientId;
    const recipientSocketId = await this.redisClient.get(`user:${recipientId}`);
    if (!recipientSocketId) {
      client.emit('error', 'Recipient not connected');
      console.error(`❌ Recipient ${recipientId} not connected`);
      return;
    }

    // Emit the message to the recipient using `this.server`
    const recipientSocket = this.server.sockets.sockets.get(recipientSocketId);
    if (!recipientSocket) {
      client.emit('error', 'Recipient not connected');
      console.error(`❌ Recipient ${recipientId} not connected`);
      return;
    }

    recipientSocket.emit('receiveMessage', {
      senderId: user.sub,
      message: payload.message,
    });
    console.log(`📬 Message sent to user ${payload.recipientId}`);
  }
}
