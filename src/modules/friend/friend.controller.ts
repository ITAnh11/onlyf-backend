import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Post('send-request')
  async sendFriendRequest(@Request() req, @Body() data: any) {
    return this.friendService.sendFriendRequest(req, data);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('accept-request')
  async acceptFriendRequest(@Request() req, @Body() data: any) {
    return this.friendService.acceptFriendRequest(req, data);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('reject-request')
  async rejectFriendRequest(@Request() req, @Body() data: any) {
    return this.friendService.rejectFriendRequest(req, data);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('get-friend-requests')
  async getFriendRequests(@Request() req) {
    return this.friendService.getFriendRequests(req);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('get-friends')
  async getFriends(@Request() req) {
    return this.friendService.getFriends(req);
  }
}
