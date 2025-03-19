import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class CheckUniqueEmailGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body;

    // Kiểm tra email đã tồn tại chưa
    if (await this.userService.findByEmail(email)) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    return true;
  }
}
