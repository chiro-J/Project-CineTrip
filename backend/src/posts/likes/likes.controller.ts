import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  Delete
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('posts')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId/likes')
  @UseGuards(JwtAuthGuard)
  async addLike(
    @Param('postId') postId: string,
    @Request() req: any,
  ): Promise<{ likeId: string; likesCount: number }> {
    return this.likesService.addLike(postId, req.user.id);
  }

  @Delete(':postId/likes/:likeId')
  @UseGuards(JwtAuthGuard)
  async removeLike(
    @Param('postId') postId: string,
    @Param('likeId') likeId: string,
    @Request() req: any,
  ): Promise<void> {
    return this.likesService.removeLike(likeId, req.user.id);
  }
}