import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  createNewToken(user: any) {
    const createdAt = new Date();

    const payload = { email: user.email, sub: user.id, createdAt };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    });

    return { accessToken, refreshToken, createdAt };
  }

  async createTokenWhenLogin(req: any) {
    const user = req.user;
    const { accessToken, refreshToken, createdAt } = this.createNewToken(user);

    await this.saveNewRefreshToken(req, refreshToken, createdAt);

    return { accessToken, refreshToken };
  }

  changeExpirationToMiliSeconds(expiration: string) {
    const value = parseInt(expiration.slice(0, -1));
    const unit = expiration.slice(-1);
    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 1000 * 60;
      case 'h':
        return value * 1000 * 60 * 60;
      case 'd':
        return value * 1000 * 60 * 60 * 24;
      case 'w':
        return value * 1000 * 60 * 60 * 24 * 7;
      case 'M':
        return value * 1000 * 60 * 60 * 24 * 30;
      case 'y':
        return value * 1000 * 60 * 60 * 24 * 365;
      default:
        return 0;
    }
  }

  async saveNewRefreshToken(req: any, refreshToken: string, createdAt: Date) {
    const userAgent = req.headers['user-agent'];
    const deviceName = req.body.deviceName;
    const userId = req.user.id;
    const newRefreshToken = this.refreshTokenRepository.create({
      user: { id: userId },
      refreshToken: bcrypt.hashSync(
        refreshToken,
        parseInt(process.env.SALT_ROUNDS || '10'),
      ),
      expireAt: new Date(
        createdAt.getTime() +
          this.changeExpirationToMiliSeconds(
            process.env.JWT_REFRESH_TOKEN_EXPIRATION || '',
          ),
      ),
      createdAt,
      deviceName,
      userAgent,
    });

    await this.refreshTokenRepository.save(newRefreshToken);
  }

  refreshNewToken(user: any, refreshExpireAt: Date) {
    // Tạo token mới
    const newCreatedAt = new Date();
    const payload = {
      email: user.email,
      sub: user.userId,
      createdAt: newCreatedAt,
    };

    const newAccessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });
    const expiresInSeconds =
      Math.floor(
        (refreshExpireAt.getTime() - newCreatedAt.getTime()) / 1000,
      ).toString() + 's';
    const newRefreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: expiresInSeconds,
    });

    return { newAccessToken, newRefreshToken, newCreatedAt };
  }

  async refreshToken(req: any) {
    const user = req.user;
    const oldRefreshToken = req.headers['authorization']?.split(' ')[1];

    const { userId, createdAt } = user;

    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: {
        user: { id: userId },
        createdAt: new Date(createdAt),
      },
    });

    if (!refreshTokenEntity) {
      throw new HttpException('Refresh token not found', HttpStatus.NOT_FOUND);
    }

    // Kiểm tra refresh token hợp lệ (so sánh hash)
    const isValid = await bcrypt.compare(
      oldRefreshToken,
      refreshTokenEntity.refreshToken,
    );
    if (!isValid) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const { newAccessToken, newRefreshToken, newCreatedAt } =
      this.refreshNewToken(user, refreshTokenEntity.expireAt);

    // Cập nhật refresh token mới vào database
    await this.refreshTokenRepository.update(refreshTokenEntity.id, {
      refreshToken: bcrypt.hashSync(
        newRefreshToken,
        parseInt(process.env.SALT_ROUNDS || '10'),
      ),
      createdAt: newCreatedAt,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async deleteRefreshToken(user: any) {
    const { user_id, createdAt } = user;

    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: { user: { id: user_id }, createdAt: new Date(createdAt) },
    });

    if (!refreshTokenEntity) {
      throw new HttpException('Not found refresh token', HttpStatus.NOT_FOUND);
    }

    await this.refreshTokenRepository.delete(refreshTokenEntity.id);
    return new HttpException('Logout success', HttpStatus.OK);
  }

  async deleteDevice(req: any) {
    const id = req.body.id;
    const userId = req.user.userId;
    const refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      id,
      user: { id: userId },
    });

    if (!refreshTokenEntity) {
      throw new HttpException('Not found refresh token', HttpStatus.NOT_FOUND);
    }

    await this.refreshTokenRepository.delete(refreshTokenEntity.id);
    return new HttpException('Delete device success', HttpStatus.OK);
  }

  async getAllDevice(req: any) {
    const userId = req.user.userId;
    const refreshTokens = await this.refreshTokenRepository.find({
      where: { user: { id: userId } },
    });

    return refreshTokens;
  }
}
