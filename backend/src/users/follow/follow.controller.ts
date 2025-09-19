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

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':userId/toggle')
  @UseGuards(JwtAuthGuard)
  async toggleFollow(
    @Param('userId') userId: string,
    @Request() req: any,
  ): Promise<{ isFollowing: boolean; followersCount: number }> {
    return this.followService.toggleFollow(
      parseInt(req.user.id),
      parseInt(userId),
    );
  }

  @Get(':userId/status')
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
}
