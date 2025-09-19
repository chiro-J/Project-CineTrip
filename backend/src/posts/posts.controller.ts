import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
  ): Promise<PostResponseDto> {
    return this.postsService.create(createPostDto, parseInt(req.user.id));
  }

  @Get()
  async findAll(@Query('userId') userId?: string): Promise<PostResponseDto[]> {
    return this.postsService.findAll(userId ? parseInt(userId) : undefined);
  }

  @Get(':postId')
  async findOne(
    @Param('postId') postId: string,
    @Query('userId') userId?: string,
  ): Promise<PostResponseDto> {
    return this.postsService.findOne(
      parseInt(postId),
      userId ? parseInt(userId) : undefined,
    );
  }

  @Patch(':postId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ): Promise<PostResponseDto> {
    return this.postsService.update(
      parseInt(postId),
      updatePostDto,
      parseInt(req.user.id),
    );
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('postId') postId: string,
    @Request() req: any,
  ): Promise<void> {
    return this.postsService.remove(parseInt(postId), parseInt(req.user.id));
  }
}
