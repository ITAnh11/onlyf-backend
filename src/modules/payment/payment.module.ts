import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Premium } from 'src/entities/premium.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremiumCronService } from './premium-cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([Premium])],
  controllers: [PaymentController],
  providers: [PaymentService, PremiumCronService],
})
export class PaymentModule {}
