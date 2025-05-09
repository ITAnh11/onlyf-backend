import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Premium } from 'src/entities/premium.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PremiumCronService {
  constructor(
    @InjectRepository(Premium)
    private readonly premiumRepository: Repository<Premium>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens() {
    console.log('Đang xóa premium hết hạn...');

    const result = await this.premiumRepository
      .createQueryBuilder()
      .delete()
      .from(Premium)
      .where(`"expireAt" < NOW()::timestamp`)
      .execute();

    console.log(`Đã xóa ${result.affected} premium hết hạn.`);
  }
}
