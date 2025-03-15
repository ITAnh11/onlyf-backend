import { Controller } from '@nestjs/common';
import { UserprofileService } from './userprofile.service';

@Controller('userprofile')
export class UserprofileController {
  constructor(private readonly userprofileService: UserprofileService) {}
}
