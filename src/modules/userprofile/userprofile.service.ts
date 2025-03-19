import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from 'src/entities/user-profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserprofileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  async createProfile(user: any, profileData: any) {
    const newProfile = this.userProfileRepository.create({
      ...profileData,
      user,
    });

    await this.userProfileRepository.save(newProfile);
  }

  async findByUsername(username: string | undefined) {
    return this.userProfileRepository.findOne({
      where: { username },
    });
  }

  async getProfile(req: any) {
    const user = req.user;
    const profile = await this.userProfileRepository.findOne({
      where: { user: { id: user.userId } },
    });

    return profile;
  }
}
