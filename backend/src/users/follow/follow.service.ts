import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async toggleFollow(
    followerId: number,
    followingId: number,
  ): Promise<{ isFollowing: boolean; followersCount: number }> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await this.userRepository.findOne({
      where: { id: followerId },
    });
    const following = await this.userRepository.findOne({
      where: { id: followingId },
    });

    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { follower_id: followerId, following_id: followingId },
    });

    if (existingFollow) {
      await this.followRepository.remove(existingFollow);
      const followersCount = await this.getFollowersCount(followingId);
      return {
        isFollowing: false,
        followersCount,
      };
    } else {
      const follow = this.followRepository.create({ 
        follower_id: followerId, 
        following_id: followingId 
      });
      await this.followRepository.save(follow);
      const followersCount = await this.getFollowersCount(followingId);
      return {
        isFollowing: true,
        followersCount,
      };
    }
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { follower_id: followerId, following_id: followingId },
    });
    return !!follow;
  }

  async getFollowers(userId: number): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { following_id: userId },
      relations: ['follower'],
    });

    return follows.map((follow) => follow.follower);
  }

  async getFollowing(userId: number): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { follower_id: userId },
      relations: ['following'],
    });

    return follows.map((follow) => follow.following);
  }

  async getFollowersCount(userId: number): Promise<number> {
    return this.followRepository.count({ where: { following_id: userId } });
  }

  async getFollowingCount(userId: number): Promise<number> {
    return this.followRepository.count({ where: { follower_id: userId } });
  }

  async removeFollow(followId: number, followerId: number): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { id: followId, follower_id: followerId },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followRepository.remove(follow);
  }
}
