import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FcmTokenService } from './fcm_token.service';
import { JwtRefreshAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('fcm-token')
export class FcmTokenController {
  constructor(private readonly fcmTokenService: FcmTokenService) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Post('save-or-update')
  async saveOrUpdateToken(@Req() req: any, @Body() body: any) {
    return await this.fcmTokenService.saveOrUpdateToken(req, body);
  }
}
