import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  Delete,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Post('send-request')
  async sendFriendRequest(@Request() req, @Query() query: any) {
    return this.friendService.sendFriendRequest(req, query);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('accept-request')
  async acceptFriendRequest(@Request() req, @Query() query: any) {
    return this.friendService.acceptFriendRequest(req, query);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('reject-request')
  async rejectFriendRequest(@Request() req, @Query() query: any) {
    return this.friendService.rejectFriendRequest(req, query);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Delete('revoke-request')
  async revokeFriendRequest(@Request() req, @Query() query: any) {
    return this.friendService.revokeFriendRequest(req, query);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('get-requests')
  async getFriendRequests(@Request() req) {
    return this.friendService.getFriendRequests(req);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('get-sent-requests')
  async getSentFriendRequests(@Request() req) {
    return this.friendService.getSentFriendRequests(req);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('get-friends')
  async getFriends(@Request() req) {
    return this.friendService.getFriends(req);
  }

  @Get('search-user')
  async searchUser(@Query('username') username: string) {
    return await this.friendService.searchUser(username);
  }
}
