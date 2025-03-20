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

  async changePassword(req: any, passwordData: any) {
    const user = await this.userRepository.findOneBy({ id: req.id });

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

    user.password = hashedPassword;

    await this.userRepository.update(user.id, user);

    return {
      success: true,
      message: 'Password changed successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
