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
      this.refreshTokenService.createTokenWhenLogin(req);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(payload: any) {
    return this.refreshTokenService.deleteRefreshToken(payload);
  }
}
