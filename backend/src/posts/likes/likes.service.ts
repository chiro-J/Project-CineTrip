import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Post } from '../entities/post.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async addLike(
    postId: number,
    userId: number,
  ): Promise<{ likeId: number; likesCount: number }> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { post_id: postId, user_id: userId },
    });

    if (existingLike) {
      throw new ForbiddenException('Already liked this post');
    }

    const like = this.likeRepository.create({ post_id: postId, user_id: userId });
    const savedLike = await this.likeRepository.save(like);

    const likesCount = await this.getLikesCount(postId);

    return {
      likeId: savedLike.id,
      likesCount,
    };
  }

  async removeLike(likeId: number, userId: number): Promise<void> {
    const like = await this.likeRepository.findOne({ where: { id: likeId } });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    if (like.user_id !== userId) {
      throw new ForbiddenException('You can only remove your own likes');
    }

    await this.likeRepository.remove(like);
  }

  async toggleLike(
    postId: number,
    userId: number,
  ): Promise<{ isLiked: boolean; likesCount: number; likeId?: number }> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { post_id: postId, user_id: userId },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      const likesCount = await this.getLikesCount(postId);
      return {
        isLiked: false,
        likesCount,
      };
    } else {
      const like = this.likeRepository.create({ post_id: postId, user_id: userId });
      const savedLike = await this.likeRepository.save(like);
      const likesCount = await this.getLikesCount(postId);
      return {
        isLiked: true,
        likesCount,
        likeId: savedLike.id,
      };
    }
  }

  async isPostLikedByUser(postId: number, userId: number): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { post_id: postId, user_id: userId },
    });
    return !!like;
  }

  async getLikesCount(postId: number): Promise<number> {
    const count = await this.likeRepository.count({ where: { post_id: postId } });
    return count;
  }
}
