import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FCMToken } from 'src/entities/fcm-token.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FcmTokenService {
    constructor(
        @InjectRepository(FCMToken)
        private readonly fcmTokenRepository: Repository<FCMToken>,

        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
    ) {}

    async saveOrUpdateToken(req: any, body: any) {
        const { token } = body;
        const user = req.user;
        const userId = user.userId;
        const createdAt = new Date(user.createdAt);

        const refreshTokenEntity = await this.refreshTokenRepository.findOne({
            where: {
                userId,
                createdAt
            },
        });
        
        if (!refreshTokenEntity) {
            throw new Error('Refresh token not found');
        }

        const refreshTokenId = refreshTokenEntity?.id;

        const existingToken = await this.fcmTokenRepository.findOne({
            where: {
                userId,
                refreshTokenId,
            },
        });
  

        if (existingToken) {
            await this.fcmTokenRepository.update(existingToken.id, {
                token: token,
            });

            return new HttpException('Token updated successfully', 200);
        } else {
            // Nếu token chưa tồn tại, tạo mới
            const newToken = this.fcmTokenRepository.create({
                userId,
                token,
                refreshTokenId,
            });
            await this.fcmTokenRepository.save(newToken);

            return new HttpException('Token saved successfully', 201);
        }
    }

    async deleteToken(userId: number, refreshTokenId: number){
        const existingToken = await this.fcmTokenRepository.findOne({
            where: {
                userId,
                refreshTokenId,
            },
        });

        if (existingToken) {
            return await this.fcmTokenRepository.delete(existingToken.id);
        } else {
            throw new Error('Token not found');
        }
    }
}
