import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt-access') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw (
        err ||
        new HttpException(
          {
            message: 'access token is expired or invalid',
            accessTokenInvalid: true,
            statusCode: HttpStatus.UNAUTHORIZED,
          },
          HttpStatus.UNAUTHORIZED,
        )
      );
    }
    return user;
  }
}

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw (
        err ||
        new HttpException(
          {
            message: 'refresh token is expired or invalid',
            refreshTokenInvalid: true,
            statusCode: HttpStatus.UNAUTHORIZED,
          },
          HttpStatus.UNAUTHORIZED,
        )
      );
    }
    return user;
  }
}
