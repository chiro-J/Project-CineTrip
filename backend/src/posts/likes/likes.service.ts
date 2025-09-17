import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async addLike(postId: string, userId: string): Promise<{ likeId: string; likesCount: number }> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      throw new ForbiddenException('Already liked this post');
    }

    const like = this.likeRepository.create({ postId, userId });
    const savedLike = await this.likeRepository.save(like);

    await this.postRepository.update(postId, {
      likesCount: () => 'likesCount + 1',
    });

    const updatedPost = await this.postRepository.findOne({ where: { id: postId } });

    return {
      likeId: savedLike.id,
      likesCount: updatedPost.likesCount,
    };
  }

  async removeLike(likeId: string, userId: string): Promise<void> {
    const like = await this.likeRepository.findOne({ where: { id: likeId } });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    if (like.userId !== userId) {
      throw new ForbiddenException('You can only remove your own likes');
    }

    await this.likeRepository.remove(like);

    await this.postRepository.update(like.postId, {
      likesCount: () => 'likesCount - 1',
    });
  }

  async toggleLike(postId: string, userId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      await this.postRepository.update(postId, {
        likesCount: () => 'likesCount - 1',
      });

      const updatedPost = await this.postRepository.findOne({ where: { id: postId } });
      return {
        isLiked: false,
        likesCount: updatedPost.likesCount,
      };
    } else {
      const like = this.likeRepository.create({ postId, userId });
      await this.likeRepository.save(like);
      await this.postRepository.update(postId, {
        likesCount: () => 'likesCount + 1',
      });

      const updatedPost = await this.postRepository.findOne({ where: { id: postId } });
      return {
        isLiked: true,
        likesCount: updatedPost.likesCount,
      };
    }
  }

  async isPostLikedByUser(postId: string, userId: string): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { postId, userId },
    });
    return !!like;
  }

  async getLikesCount(postId: string): Promise<number> {
    const count = await this.likeRepository.count({ where: { postId } });
    return count;
  }
}