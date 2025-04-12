import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import Redis from 'ioredis';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OTPService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  randomOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async getOTPMailForRegister(req: any) {
    const { email } = req.body;
    const OTPCode = this.randomOTP();
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.isActivated) {
      throw new HttpException(
        { message: 'User already activated' },
        HttpStatus.BAD_REQUEST,
      );
    }
    this.mailerService.sendMail({
      to: email,
      subject: 'OTP for registration',
      template: 'register.hbs',
      context: {
        OTPCode,
      },
    });
    this.redisClient.set(`OTP_${email}`, OTPCode, 'EX', 300); // Set OTP with 5 minutes expiration
    return new HttpException(
      { message: 'OTP sent successfully' },
      HttpStatus.OK,
    );
  }

  async verifyOTPMailForRegister(req: any) {
    const { email, OTPCode } = req.body;
    const storedOTP = await this.redisClient.get(`OTP_${email}`);

    if (storedOTP === OTPCode) {
      await this.redisClient.del(`OTP_${email}`);
      await this.userService.activateUser(email);
      return new HttpException('OTP verified successfully', HttpStatus.OK);
    } else {
      return new HttpException(
        'Invalid OTP or OTP expired',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOTPMailForForgotPassword(req: any) {
    const { email } = req.body;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const OTPCode = this.randomOTP();
    this.mailerService.sendMail({
      to: email,
      subject: 'OTP for forgot password',
      template: 'forgot-password.hbs',
      context: {
        OTPCode,
      },
    });
    await this.redisClient.set(`OTP_${email}`, OTPCode, 'EX', 300);
    return new HttpException(
      { message: 'OTP sent successfully' },
      HttpStatus.OK,
    );
  }

  async createAccessTokenForForgotPassword(user: any) {
    const createdAt = new Date();
    const payload = {
      sub: user.id,
      email: user.email,
      createdAt,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '20m',
    });

    return accessToken;
  }

  async verifyOTPMailForForgotPassword(req: any) {
    const { email, OTPCode } = req.body;
    const storedOTP = await this.redisClient.get(`OTP_${email}`);
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (storedOTP === OTPCode) {
      await this.redisClient.del(`OTP_${email}`);

      const accessToken = await this.createAccessTokenForForgotPassword(user);

      return new HttpException(
        {
          message: 'OTP verified successfully',
          accessToken,
        },
        HttpStatus.OK,
      );
    } else {
      throw new HttpException(
        { message: 'Invalid OTP or OTP expired' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
