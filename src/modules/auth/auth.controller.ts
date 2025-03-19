import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CheckUniqueUserGuard } from 'src/guards/check-unique-user.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import {
  JwtAccessAuthGuard,
  JwtRefreshAuthGuard,
} from 'src/guards/jwt-auth.guard';
import { ConfirmPasswordGuard } from 'src/guards/confirm-password.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ConfirmPasswordGuard)
  @UseGuards(CheckUniqueUserGuard)
  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Delete('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }
}
