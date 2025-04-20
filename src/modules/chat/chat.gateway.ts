import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { NotificationService } from '../notification/notification.service';
import { ChatService } from './chat.service';

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
  ) {}
  
  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token.split(' ')[1]; // Bearer <token>
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
