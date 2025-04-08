import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class ConfirmPasswordGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { password, confirmPassword } = request.body;

    if (password !== confirmPassword) {
      throw new HttpException(
        'Password and confirm password do not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
