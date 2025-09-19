import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Like } from './likes/entities/like.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    authorId: number,
  ): Promise<PostResponseDto> {
    const post = this.postRepository.create({
      ...createPostDto,
      authorId,
    });

    const savedPost = await this.postRepository.save(post);
    return this.findOne(savedPost.id, authorId);
  }

  async findAll(userId?: number): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      posts.map(async (post) => {
        const isLiked = userId
          ? await this.isPostLikedByUser(post.id, userId)
          : false;
        return this.mapToResponseDto(post, isLiked);
      }),
    );
  }

  async findOne(id: number, userId?: number): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const isLiked = userId ? await this.isPostLikedByUser(id, userId) : false;
    return this.mapToResponseDto(post, isLiked);
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    await this.postRepository.update(id, updatePostDto);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.remove(post);
  }

  async findByAuthor(
    authorId: number,
    userId?: number,
  ): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      where: { authorId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      posts.map(async (post) => {
        const isLiked = userId
          ? await this.isPostLikedByUser(post.id, userId)
          : false;
        return this.mapToResponseDto(post, isLiked);
      }),
    );
  }

  private async isPostLikedByUser(
    postId: number,
    userId: number,
  ): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { postId, userId },
    });
    return !!like;
  }

  private mapToResponseDto(
    post: Post,
    isLiked: boolean = false,
  ): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      location: post.location,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      authorId: post.authorId,
      author: {
        id: post.author.id,
        username: post.author.username,
        profileImageUrl: post.author.profileImageUrl,
      },
      isLiked,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
