import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';
import { ConfirmPasswordGuard } from 'src/guards/confirm-password.guard';
import { PasswordDto } from './dto/password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(ConfirmPasswordGuard)
  @UseGuards(JwtAccessAuthGuard)
  @Post('reset-password')
  async resetPassword(@Req() req, @Body() data: PasswordDto) {
    return await this.userService.resetPassword(req, data);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('generate-invite-link')
  async generateInviteLink(@Req() req) {
    return await this.userService.generateInviteLink(req);
  }
}
