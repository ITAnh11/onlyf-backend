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
import { CheckUniqueEmailGuard } from 'src/guards/check-unique-email.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtRefreshAuthGuard } from 'src/guards/jwt-auth.guard';
import { ConfirmPasswordGuard } from 'src/guards/confirm-password.guard';
import { CheckUniqueUsernameGuard } from 'src/guards/check-unique-username.guard';
import { OTPService } from './otp.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OTPService,
  ) {}

  @UseGuards(ConfirmPasswordGuard)
  @UseGuards(CheckUniqueUsernameGuard)
  @UseGuards(CheckUniqueEmailGuard)
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

  @UseGuards(JwtRefreshAuthGuard)
  @Get('is-logged-in')
  async isLoggedIn(@Request() req) {
    return this.authService.isLoggedIn(req);
  }

  @Get('get-otp-mail-for-register')
  async getOTPMailForRegister(@Request() req) {
    return this.otpService.getOTPMailForRegister(req);
  }

  @Post('verify-otp-mail-for-register')
  async verifyOTPMailForRegister(@Request() req) {
    return this.otpService.verifyOTPMailForRegister(req);
  }

  @Get('get-otp-mail-for-forgot-password')
  async getOTPMailForForgotPassword(@Request() req) {
    return this.otpService.getOTPMailForForgotPassword(req);
  }

  @Post('verify-otp-mail-for-forgot-password')
  async verifyOTPMailForForgotPassword(@Request() req) {
    return this.otpService.verifyOTPMailForForgotPassword(req);
  }
}
