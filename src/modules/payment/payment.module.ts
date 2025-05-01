import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Premium } from 'src/entities/premium.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Premium])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
