import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserprofileService } from 'src/modules/userprofile/userprofile.service';

@Injectable()
export class CheckUniqueUsernameGuard implements CanActivate {
  constructor(private readonly userProfileService: UserprofileService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { username } = request.body;

    if (!username) {
      return true;
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
