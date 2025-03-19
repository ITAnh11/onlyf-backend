import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserprofileService } from './userprofile.service';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';
import { CheckUniqueUsernameGuard } from 'src/guards/check-unique-username.guard';
import { UpdateUserDto } from './dto/update-profile.dto';

@Controller('userprofile')
export class UserprofileController {
  constructor(private readonly userprofileService: UserprofileService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Get('get-profile')
  getProfile(@Request() req) {
    return this.userprofileService.getProfile(req);
  }

  @UseGuards(JwtAccessAuthGuard)
  @UseGuards(CheckUniqueUsernameGuard)
  @Post('update-profile')
  updateProfile(@Request() req, @Body() data: UpdateUserDto) {
    return this.userprofileService.updateProfile(req, data);
  }
}
