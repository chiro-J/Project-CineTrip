import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { User } from '../entities/user.entity';

@Controller('user')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':userId/follow')
  @UseGuards(JwtAuthGuard)
  async toggleFollow(
    @Param('userId') userId: string,
    @Request() req: any,
  ): Promise<{ isFollowing: boolean; followersCount: number }> {
    console.log('Follow request - req.user:', req.user);
    console.log('Follow request - userId param:', userId);
    
    const followerId = parseInt(req.user.id || req.user.userId);
    const followingId = parseInt(userId);
    
    console.log('Parsed IDs - followerId:', followerId, 'followingId:', followingId);
    
    if (isNaN(followerId) || isNaN(followingId)) {
      throw new Error(`Invalid IDs: followerId=${followerId}, followingId=${followingId}`);
    }
    
    return this.followService.toggleFollow(followerId, followingId);
  }

  @Get(':userId/follow')
  @UseGuards(JwtAuthGuard)
  async getFollowStatus(
    @Param('userId') userId: string,
    @Request() req: any,
  ): Promise<{ isFollowing: boolean }> {
    const isFollowing = await this.followService.isFollowing(
      parseInt(req.user.id),
      parseInt(userId),
    );
    return { isFollowing };
  }

  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: string): Promise<User[]> {
    return this.followService.getFollowers(parseInt(userId));
  }

  @Get(':userId/following')
  async getFollowing(@Param('userId') userId: string): Promise<User[]> {
    return this.followService.getFollowing(parseInt(userId));
  }

  @Get(':userId/followers/count')
  async getFollowersCount(
    @Param('userId') userId: string,
  ): Promise<{ followersCount: number }> {
    const followersCount = await this.followService.getFollowersCount(
      parseInt(userId),
    );
    return { followersCount };
  }

  @Get(':userId/following/count')
  async getFollowingCount(
    @Param('userId') userId: string,
  ): Promise<{ followingCount: number }> {
    const followingCount = await this.followService.getFollowingCount(
      parseInt(userId),
    );
    return { followingCount };
  }

  @Delete(':userId/follow/:followId')
  @UseGuards(JwtAuthGuard)
  async removeFollow(
    @Param('userId') userId: string,
    @Param('followId') followId: string,
    @Request() req: any,
  ): Promise<void> {
    const followerId = parseInt(req.user.id);
    const followingId = parseInt(userId);
    
    if (followerId !== followingId) {
      throw new Error('You can only remove your own follows');
    }
    
    return this.followService.removeFollow(parseInt(followId), followerId);
  }
}
