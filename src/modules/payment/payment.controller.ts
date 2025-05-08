import { Controller, Get, Headers, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('create-checkout-session')
  async createCheckoutSession(@Req() req: any, @Query() query: any) {
    return this.paymentService.createCheckoutSession(req, query);
  }

  @Post('webhook')
    async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
      return this.paymentService.handleWebhook(req, res, signature);
    }
  
  @Get('success')
  successRedirectToApp(@Query('session_id') sessionId: string, @Res() res: Response) {
    const redirectUrl = `${process.env.SCHEME}://payment/success?session_id=${sessionId}`;
    return res.redirect(redirectUrl);
  }

  @Get('cancel')
  cancelRedirectToApp(@Res() res: Response) {
    const redirectUrl = `${process.env.SCHEME}://payment/cancel`;
    return res.redirect(redirectUrl); 
  }
}
