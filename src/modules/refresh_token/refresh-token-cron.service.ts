import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenCronService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens() {
    console.log('Đang xóa refresh token hết hạn...');

    const result = await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .from(RefreshToken)
      .where(`"expireAt" < NOW()::timestamp`)
      .execute();

    console.log(`Đã xóa ${result.affected} token hết hạn.`);
  }
}
