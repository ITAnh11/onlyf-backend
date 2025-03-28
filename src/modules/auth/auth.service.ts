import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from '../refresh_token/refresh_token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async register(user: any) {
    return this.userService.create(user);
  }

  async login(req: any) {
    const { accessToken, refreshToken } =
      await this.refreshTokenService.createTokenWhenLogin(req);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(payload: any) {
    return await this.refreshTokenService.deleteRefreshToken(payload);
  }

  async isLoggedIn(req: any) {
    const payload = req.user;
    const refreshToken = req.headers['authorization']?.split(' ')[1];
    const result = await this.refreshTokenService.validateRefreshToken(
      payload,
      refreshToken,
    );

    if (result) {
      return {
        isLoggedIn: true,
      };
    }

    return {
      isLoggedIn: false,
    };
  }
}
