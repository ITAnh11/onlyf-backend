import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FriendRequest,
  FriendRequestStatus,
} from 'src/entities/friend-request.entity';
import { Friend } from 'src/entities/friend.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserprofileService } from '../userprofile/userprofile.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,

    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userProfileService: UserprofileService,

    private readonly notificationService: NotificationService,
  ) {}

  async sendFriendRequest(req: any, query: any): Promise<FriendRequest> {
    const userId = req.user.userId; // Assuming req.user contains the user object
    const receiverId = parseInt(query.receiverId); // Assuming the receiver ID is passed in the request body

    const existingRequest = await this.friendRequestRepository.findOne({
      where: {
        senderId: userId,
        receiverId: receiverId,
      },
    });

    if (existingRequest) {
      if (existingRequest.status === FriendRequestStatus.ACCEPTED) {
        throw new HttpException(
          'You are already friends with this user.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (existingRequest.status === FriendRequestStatus.PENDING) {
        throw new HttpException(
          'Friend request already sent.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (existingRequest.status === FriendRequestStatus.REJECTED) {
        // If the request was rejected, we can create a new one
        await this.friendRequestRepository.remove(existingRequest);
      }
    }

    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new HttpException('Receiver not found.', HttpStatus.NOT_FOUND);
    }

    if (receiverId === userId) {
      throw new HttpException(
        'You cannot send a friend request to yourself.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newFriendRequest = this.friendRequestRepository.create({
      senderId: userId,
      receiverId: receiverId,
    });
    try {

      const senderProfile = await this.userProfileService.getProfile({user: {userId}});

      const savedRequest = await this.friendRequestRepository.save(
        newFriendRequest,
      );

      this.notificationService.notifyUserFCM(
        receiverId,
        'Friend Request',
        `${senderProfile?.name} has sent you a friend request.`,
        {
          senderId: userId.toString(),
          senderName: senderProfile?.name,
          senderAvatar: senderProfile?.urlPublicAvatar,
        },
        userId
      );

      return savedRequest;

    } catch (error) {
      throw new Error('Error sending friend request: ' + error.message);
    }
  }

  async acceptFriendRequest(req: any, query: any) {
    const userId = req.user.userId; // Assuming req.user contains the user object
    const requestId = parseInt(query.requestId); // Assuming the request ID is passed in the request body

    try {
      const friendRequest = await this.friendRequestRepository.findOne({
        where: { id: requestId, receiverId: userId },
        relations: ['sender', 'receiver'],
      });

      if (!friendRequest) {
        throw new HttpException(
          'Friend request not found or you do not have permission to accept it.',
          HttpStatus.NOT_FOUND,
        );
      }

      if (friendRequest.status !== FriendRequestStatus.PENDING) {
        throw new HttpException(
          'Friend request is not pending.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newFriend1 = this.friendRepository.create({
        userId: userId,
        friendId: friendRequest.senderId,
      });
      const newFriend2 = this.friendRepository.create({
        userId: friendRequest.senderId,
        friendId: userId,
      });

      await this.friendRepository.save(newFriend1);
      await this.friendRepository.save(newFriend2);
      await this.friendRequestRepository.update(requestId, {
        status: FriendRequestStatus.ACCEPTED,
      });

      return {
        message: 'Friend request accepted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new Error('Error accepting friend request: ' + error.message);
    }
  }

  async rejectFriendRequest(req: any, query: any) {
    const userId = req.user.userId; // Assuming req.user contains the user object
    const requestId = parseInt(query.requestId); // Assuming the request ID is passed in the request body

    try {
      const friendRequest = await this.friendRequestRepository.findOne({
        where: { id: requestId, receiverId: userId },
      });

      if (!friendRequest) {
        throw new HttpException(
          'Friend request not found or you do not have permission to reject it.',
          HttpStatus.NOT_FOUND,
        );
      }

      if (friendRequest.status !== FriendRequestStatus.PENDING) {
        throw new HttpException(
          'Friend request is not pending.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.friendRequestRepository.update(requestId, {
        status: FriendRequestStatus.REJECTED,
      });

      return {
        message: 'Friend request rejected successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new Error('Error rejecting friend request: ' + error.message);
    }
  }

  async revokeFriendRequest(req: any, query: any) {
    const userId = req.user.userId; // Assuming req.user contains the user object
    const requestId = parseInt(query.requestId); // Assuming the request ID is passed in the request body
    try {
      const friendRequest = await this.friendRequestRepository.findOne({
        where: { id: requestId, senderId: userId },
      });

      if (!friendRequest) {
        throw new HttpException(
          'Friend request not found or you do not have permission to revoke it.',
          HttpStatus.NOT_FOUND,
        );
      }

      if (friendRequest.status !== FriendRequestStatus.PENDING) {
        throw new HttpException(
          'Friend request is not pending.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.friendRequestRepository.remove(friendRequest);

      return {
        message: 'Friend request revoked successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new Error('Error revoking friend request: ' + error.message);
    }
  }

  async getFriendRequests(req: any) {
    const userId = req.user.userId; // Assuming req.user contains the user object
    try {
      return await this.friendRequestRepository
        .createQueryBuilder('friendRequest')
        .leftJoinAndSelect('friendRequest.sender', 'sender') // Lấy thông tin người gửi từ bảng User
        .leftJoinAndSelect('sender.profile', 'profile') // Lấy thông tin từ bảng UserProfile
        .where('friendRequest.receiver.id = :userId', { userId }) // Điều kiện: người nhận là bạn
        .andWhere('friendRequest.status = :status', {
          status: FriendRequestStatus.PENDING,
        }) // Chỉ lấy yêu cầu đang chờ xử lý
        .select([
          'friendRequest.id', // Chỉ định các trường cần lấy
          'friendRequest.status',
          'profile.name',
          'profile.username',
          'profile.urlPublicAvatar', // Giả sử bạn có trường avatarUrl trong UserProfile
          'friendRequest.createdAt', // Thêm trường createdAt từ bảng FriendRequest
          'sender.id', // Thêm trường id từ bảng User
        ])
        .orderBy('friendRequest.createdAt', 'DESC') // Sắp xếp theo thời gian tạo
        .getMany();
    } catch (error) {
      throw new Error('Error fetching friend requests: ' + error.message);
    }
  }

  async getSentFriendRequests(req: any) {
    const userId = req.user.userId; // Assuming req.user contains the user object
    try {
      return await this.friendRequestRepository
        .createQueryBuilder('friendRequest')
        .leftJoinAndSelect('friendRequest.receiver', 'receiver') // Lấy thông tin người nhận từ bảng User
        .leftJoinAndSelect('receiver.profile', 'profile') // Lấy thông tin từ bảng UserProfile
        .where('friendRequest.sender.id = :userId', { userId }) // Điều kiện: người gửi là bạn
        .andWhere('friendRequest.status = :status', {
          status: FriendRequestStatus.PENDING,
        }) // Chỉ lấy yêu cầu đang chờ xử lý
        .select([
          'friendRequest.id', // Chỉ định các trường cần lấy
          'friendRequest.status',
          'profile.name',
          'profile.username',
          'profile.urlPublicAvatar', // Giả sử bạn có trường avatarUrl trong UserProfile
          'friendRequest.createdAt', // Thêm trường createdAt từ bảng FriendRequest
          'receiver.id', // Thêm trường id từ bảng User
        ])
        .orderBy('friendRequest.createdAt', 'DESC') // Sắp xếp theo thời gian tạo
        .getMany();
    } catch (error) {
      throw new Error('Error fetching sent friend requests: ' + error.message);
    }
  }

  async getFriends(req: any) {
    const userId = req.user.userId; // Assuming req.user contains the user object
    try {
      return await this.friendRepository
        .createQueryBuilder('friend')
        .leftJoinAndSelect('friend.friend', 'friendUser') // Lấy thông tin người bạn từ bảng User
        .leftJoinAndSelect('friendUser.profile', 'profile') // Lấy thông tin từ bảng UserProfile
        .where('friend.user.id = :userId', { userId }) // Điều kiện: người dùng là bạn
        .select([
          'friend.id',
          'profile.name',
          'profile.username',
          'profile.urlPublicAvatar',
          'friendUser.id',
        ])
        .orderBy('friend.createdAt', 'DESC') // Sắp xếp theo thời gian tạo
        .getMany();
    } catch (error) {
      throw new Error('Error fetching friends: ' + error.message);
    }
  }

  async searchUser(username: string) {
    return await this.userProfileService.searchUser(username);
  }

  async unfriend(req: any, query: any) {
    const userId = req.user.userId; // Assuming req.user contains the user object
    const friendId = parseInt(query.friendId); // Assuming the friend ID is passed in the request body

    try {
      const friend1 = await this.friendRepository.findOne({
        where: { userId, friendId },
      });

      const friend2 = await this.friendRepository.findOne({
        where: { userId: friendId , friendId: userId  },
      });

      if (!friend1 || !friend2) {
        return new HttpException(
          'Friend not found or you do not have permission to unfriend it.',
          HttpStatus.NOT_FOUND,
        );
      }

      const friendRequest = await this.friendRequestRepository
        .createQueryBuilder('friendRequest')
        .where(
          '(friendRequest.sender.id = :userId AND friendRequest.receiver.id = :friendId) OR (friendRequest.sender.id = :friendId AND friendRequest.receiver.id = :userId)',
          { userId, friendId },
        )
        .getOne();
      if (friendRequest) {
        await this.friendRequestRepository.remove(friendRequest);
      }

      // Remove the friend relationship
      await this.friendRepository.remove(friend1);
      await this.friendRepository.remove(friend2);

      return {
        message: 'Unfriended successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new Error('Error unfriending user: ' + error.message);
    }
  }
}
