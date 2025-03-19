import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserprofileService } from './userprofile.service';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('userprofile')
export class UserprofileController {
  constructor(private readonly userprofileService: UserprofileService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Get('get-profile')
  getProfile(@Request() req) {
    return this.userprofileService.getProfile(req);
  }
}
