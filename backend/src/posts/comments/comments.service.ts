import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from '../entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(
    postId: number,
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<CommentResponseDto> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      postId,
      userId,
    });

    const savedComment = await this.commentRepository.save(comment);

    await this.postRepository.update(postId, {
      commentsCount: () => 'commentsCount + 1',
    });

    return this.findOne(savedComment.id);
  }

  async findByPost(postId: number): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { postId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });

    return comments.map((comment) => this.mapToResponseDto(comment));
  }

  async findOne(id: number): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.mapToResponseDto(comment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);

    await this.postRepository.update(comment.postId, {
      commentsCount: () => 'commentsCount - 1',
    });
  }

  private mapToResponseDto(comment: Comment): CommentResponseDto {
    return {
      id: comment.id,
      text: comment.text,
      userId: comment.userId,
      postId: comment.postId,
      user: {
        id: comment.user.id,
        username: comment.user.username,
        profileImageUrl: comment.user.profileImageUrl,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
