import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserprofileService } from '../userprofile/userprofile.service';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userProfileService: UserprofileService,
  ) {}

  async findByEmail(email: string | undefined) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number | undefined) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async create(userData: any) {
    const newUser = this.userRepository.create({
      email: userData.email,
      password: userData.password,
    });

    const hashedPassword = bcrypt.hashSync(
      userData.password,
      parseInt(process.env.SALT_ROUNDS || '10'),
    );
    newUser.password = hashedPassword;

    await this.userRepository.save(newUser);

    await this.userProfileService.createProfile(newUser, {
      ...userData,
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        isActivated: newUser.isActivated,
        createdAt: newUser.createdAt,
      },
      message: 'User created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async resetPassword(req: any, passwordData: any) {
    console.log(req.user);
    const userId = req.user.userId;
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const hashedPassword = await bcrypt.hashSync(
      passwordData.password,
      parseInt(process.env.SALT_ROUNDS || '10'),
    );

    await this.userRepository.update(user.id, {
      password: hashedPassword,
    });

    return {
      success: true,
      message: 'Password reset successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async activateUser(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.isActivated = true;

    await this.userRepository.update(user.id, user);

    return {
      success: true,
      message: 'User activated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async isPremium(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['premium'],
    });

    if (!user) {
      return false;
    }

    if (!user.premium) {
      return false;
    }

    const currentDate = new Date();
    const expireDate = new Date(user.premium.expireAt);

    if (user.premium.isPremium && expireDate > currentDate) {
      return true;
    }
    
    return false;
  }

  async generateInviteLink(req: any) {
    const userId = req.user.userId;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const queryParams = new URLSearchParams({
      userId: user.id.toString(),
      username: user.profile.username,
      name: user.profile.name,
      avatar: user.profile.urlPublicAvatar,
    });

    const inviteLink = `${process.env.DOMAIN_FIREBASE_HOSTING}/invite/?${queryParams.toString()}`;

    return {
      success: true,
      message: 'Invite link generated successfully',
      statusCode: HttpStatus.OK,
      inviteLink,
    };
  }
}
