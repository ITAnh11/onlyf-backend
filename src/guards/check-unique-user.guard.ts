import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { UserprofileService } from 'src/modules/userprofile/userprofile.service';

@Injectable()
export class CheckUniqueUserGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly userProfileService: UserprofileService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email, username } = request.body;

    // Kiểm tra email đã tồn tại chưa
    if (await this.userService.findByEmail(email)) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    // Kiểm tra username đã tồn tại chưa
    if (await this.userProfileService.findByUsername(username)) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
