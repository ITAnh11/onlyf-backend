import {
  Body,
  Controller,
  Get,
  Post,
  Query,
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
  @Post('change-password')
  async changePassword(@Req() req, @Body() data: PasswordDto) {
    return await this.userService.changePassword(req.user, data);
  }

  @Get('search-user')
  async searchUser(@Query('username') username: string) {
    return await this.userService.searchUser(username);
  }
}
