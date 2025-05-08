import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Premium } from 'src/entities/premium.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '',);
    constructor(
        @InjectRepository(Premium)
        private readonly premiumRepository: Repository<Premium>,
    ) {}

    async createCheckoutSession(req: any, query: any) {
        const { type } = query; // month or year
        const userId = req.user.userId;

        if (!type || (type !== 'month' && type !== 'year')) {
            throw new Error('Invalid subscription type');
        }

        // Kiểm tra xem người dùng đã có gói Premium chưa
        const existingPremium = await this.premiumRepository.findOne({
            where: { userId: userId },
        });
        if (existingPremium?.isPremium && new Date(existingPremium.expireAt) > new Date()) {
            throw new HttpException(
                'User already has a premium subscription',
                400,
            );
        }

        // Tạo session thanh toán
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['bancontact', 'card', 'eps', 'ideal', 'p24', 'sepa_debit'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Premium ${type === 'month' ? 'Monthly' : 'Yearly'} Subscription`,
                        },
                        unit_amount: type === 'month' ? 999 : 9999, // 9.99 USD for monthly, 99.99 USD for yearly
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NGROK_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NGROK_URL}/payment/cancel`,
            metadata: {
                userId: userId.toString(),
                type: type,
            },
        });

        return {
            url: session.url,
        };
    }

    async handleWebhook(req: any, res: any, signature: string) {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
              req.body,
              signature,
              endpointSecret,
            );
          } catch (err) {
            console.error('⚠️ Webhook signature verification failed.', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
          }
      
          // 📌 Xử lý event ở đây
          if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            if (!session.metadata) {
                console.error('⚠️ Metadata không tồn tại trong session.');
                return res.status(400).send('Metadata không tồn tại trong session.');
            }
            const userId = parseInt(session.metadata.userId);
      
            console.log(`🎉 User ${userId} đã thanh toán thành công.`);
      
            const exisingPremium = await this.premiumRepository.findOne({
              where: { userId: userId },
            });
            if (exisingPremium) {
                console.log(`⚠️ User ${userId} đã có gói Premium.`);
                this.premiumRepository.update(
                  { userId: userId },
                  { isPremium: true, expireAt: new Date(Date.now() + (session.metadata.type === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000) },
                );
                return res.status(200).send('Webhook received');
            }

            const newPremium = this.premiumRepository.create({
              userId: userId,
              isPremium: true,
              expireAt: new Date(Date.now() + (session.metadata.type === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000),
            });
            await this.premiumRepository.save(newPremium);
            console.log(`🎉 User ${userId} đã được cấp gói Premium.`);
          }
      
          res.status(200).send('Webhook received');
    }
}
