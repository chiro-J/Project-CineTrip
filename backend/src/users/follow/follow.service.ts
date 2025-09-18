import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    followerId: string,
    followingId: string,
  ): Promise<{ isFollowing: boolean; followersCount: number }> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await this.userRepository.findOne({ where: { id: followerId } });
    const following = await this.userRepository.findOne({ where: { id: followingId } });

    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      await this.followRepository.remove(existingFollow);

      await this.userRepository.update(followerId, {
        followingCount: () => 'followingCount - 1',
      });
      await this.userRepository.update(followingId, {
        followersCount: () => 'followersCount - 1',
      });

      const updatedUser = await this.userRepository.findOne({ where: { id: followingId } });
      return {
        isFollowing: false,
        followersCount: updatedUser?.followersCount || 0,
      };
    } else {
      const follow = this.followRepository.create({ followerId, followingId });
      await this.followRepository.save(follow);

      await this.userRepository.update(followerId, {
        followingCount: () => 'followingCount + 1',
      });
      await this.userRepository.update(followingId, {
        followersCount: () => 'followersCount + 1',
      });

      const updatedUser = await this.userRepository.findOne({ where: { id: followingId } });
      return {
        isFollowing: true,
        followersCount: updatedUser?.followersCount || 0,
      };
    }
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    return !!follow;
  }

  async getFollowers(userId: string): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { followingId: userId },
      relations: ['follower'],
    });

    return follows.map(follow => follow.follower);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { followerId: userId },
      relations: ['following'],
    });

    return follows.map(follow => follow.following);
  }

  async getFollowersCount(userId: string): Promise<number> {
    return this.followRepository.count({ where: { followingId: userId } });
  }

  async getFollowingCount(userId: string): Promise<number> {
    return this.followRepository.count({ where: { followerId: userId } });
  }
}