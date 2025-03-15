import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserSerializer } from './serializer/user.serializer';
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
      username: userData.username,
      name: userData.name,
    });

    return {
      success: true,
      message: 'User created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  async getUser(id: number): Promise<UserSerializer> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return new UserSerializer(user);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }
}
