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
      author_id: authorId,
    });

    const savedPost = await this.postRepository.save(post);
    
    // author 관계를 포함해서 다시 조회
    const postWithAuthor = await this.postRepository.findOne({
      where: { id: savedPost.id },
      relations: ['author'],
    });
    
    if (!postWithAuthor) {
      throw new NotFoundException('Post not found');
    }
    
    return await this.mapToResponseDto(postWithAuthor, false);
  }

  async findAll(userId?: number): Promise<PostResponseDto[]> {
    const whereCondition = userId ? { author_id: userId } : {};
    
    const posts = await this.postRepository.find({
      where: whereCondition,
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      posts.map(async (post) => {
        const isLiked = userId
          ? await this.isPostLikedByUser(post.id, userId)
          : false;
        return await this.mapToResponseDto(post, isLiked);
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

    if (post.author_id !== userId) {
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

    if (post.author_id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.remove(post);
  }

  async findByAuthor(
    authorId: number,
    userId?: number,
  ): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      where: { author_id: authorId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      posts.map(async (post) => {
        const isLiked = userId
          ? await this.isPostLikedByUser(post.id, userId)
          : false;
        return await this.mapToResponseDto(post, isLiked);
      }),
    );
  }

  private async isPostLikedByUser(
    postId: number,
    userId: number,
  ): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { post_id: postId, user_id: userId },
    });
    return !!like;
  }

  private async mapToResponseDto(
    post: Post,
    isLiked: boolean = false,
  ): Promise<PostResponseDto> {
    const likesCount = await this.getLikesCount(post.id);
    
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.image_url,
      location: post.location,
      authorId: post.author_id,
      author: post.author ? {
        id: post.author.id,
        username: post.author.username,
        profileImageUrl: post.author.profile_image_url,
      } : {
        id: post.author_id,
        username: 'Unknown User',
        profileImageUrl: undefined,
      },
      isLiked,
      likesCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private async getLikesCount(postId: number): Promise<number> {
    return this.likeRepository.count({ where: { post_id: postId } });
  }
}
