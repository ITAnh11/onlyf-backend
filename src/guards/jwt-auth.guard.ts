import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt-access') {}

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {}
