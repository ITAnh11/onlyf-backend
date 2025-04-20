import { Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
  imports: [
  ],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis(
          `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        );
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
