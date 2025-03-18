import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import {
  JwtAccessAuthGuard,
  JwtRefreshAuthGuard,
} from 'src/guards/jwt-auth.guard';
import { RefreshTokenService } from './refresh_token.service';

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh-token')
  async refreshToken(@Request() req) {
    return this.refreshTokenService.refreshToken(req);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('delete-device')
  async deleteDevice(@Request() req) {
    return this.refreshTokenService.deleteDevice(req);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('get-all-device')
  async getAllDevice(@Request() req) {
    return this.refreshTokenService.getAllDevice(req);
  }
}
