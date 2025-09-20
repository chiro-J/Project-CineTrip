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
      post_id: postId,
      user_id: userId,
    });

    const savedComment = await this.commentRepository.save(comment);

    return this.findOne(savedComment.id);
  }

  async findByPost(postId: number): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { post_id: postId },
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

    if (comment.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);
  }

  private mapToResponseDto(comment: Comment): CommentResponseDto {
    return {
      id: comment.id,
      text: comment.text,
      userId: comment.user_id,
      postId: comment.post_id,
      user: comment.user ? {
        id: comment.user.id,
        username: comment.user.username,
        profileImageUrl: comment.user.profile_image_url || undefined,
      } : {
        id: comment.user_id,
        username: 'Unknown User',
        profileImageUrl: undefined,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.createdAt, // updatedAt 필드가 없으므로 createdAt과 동일하게 설정
    };
  }
}
