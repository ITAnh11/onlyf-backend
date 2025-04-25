import { Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Post('reply-to-post')
  async replyToPost(@Request() req: any) {
    return await this.chatService.replyToPost(req);
  }
 

  @UseGuards(JwtAccessAuthGuard)
  @Get('get-messages')
  async getMessages(@Request() req: any, @Query() query: any) {
    return await this.chatService.getMessages(req, query);
  }

}
