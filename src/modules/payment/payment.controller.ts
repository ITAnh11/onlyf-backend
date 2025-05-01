import { Controller, Headers, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';

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
}
