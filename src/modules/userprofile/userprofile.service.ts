import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from 'src/entities/user-profile.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UserprofileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,

    private readonly firebaseService: FirebaseService,
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
      relations: ['user'],
      select: {
        id: true,
        user: { id: true, email: true },
        username: true,
        name: true,
        dob: true,
        phone: true,
        urlPublicAvatar: true,
        pathAvatar: true,
      },
    });

    return profile;
  }

  async updateProfile(req: any, data: any) {
    const user = req.user;
    const profile = await this.userProfileRepository.findOne({
      where: { user: { id: user.userId } },
    });

    if (!profile) {
      return new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    await this.userProfileRepository.update(profile.id, data);

    return {
      userProfile: await this.userProfileRepository.findOne({
        where: { user: { id: user.userId } },
      }),
      success: true,
      message: 'Profile updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async updateAvatar(req: any, data: any) {
    const user = req.user;
    const profile = await this.userProfileRepository.findOne({
      where: { user: { id: user.userId } },
    });

    if (!profile) {
      return new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    await this.userProfileRepository.update(profile.id, data);

    return {
      success: true,
      message: 'Avatar updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async deleteAvatar(req: any) {
    const user = req.user;
    const profile = await this.userProfileRepository.findOne({
      where: { user: { id: user.userId } },
    });

    if (!profile) {
      return new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const oldAvatarPath = profile.pathAvatar;
    if (oldAvatarPath) {
      try {
        await this.firebaseService.deleteFile(oldAvatarPath);
      } catch (error) {
        console.error('Error deleting file:', error);
        throw new HttpException(
          'Error deleting file from Firebase Storage',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    await this.userProfileRepository.update(profile.id, {
      urlPublicAvatar: '',
      pathAvatar: '',
    });

    return {
      success: true,
      message: 'Avatar deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async searchUser(username: string) {
    const users = await this.userProfileRepository
      .createQueryBuilder('userProfile')
      .leftJoinAndSelect('userProfile.user', 'user')
      .where('userProfile.username ILIKE :username', {
        username: `${username}%`,
      })
      .select([
        'userProfile.name',
        'userProfile.username',
        'userProfile.urlPublicAvatar',
        'user.id',
      ])
      .limit(10)
      .getMany();

    if (users.length === 0) {
      return new HttpException('No users found', HttpStatus.NOT_FOUND);
    }

    return users;
  }
}
