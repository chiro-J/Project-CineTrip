import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('posts')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ): Promise<CommentResponseDto> {
    return this.commentsService.create(postId, createCommentDto, req.user.id);
  }

  @Get(':postId/comments')
  async findByPost(
    @Param('postId') postId: string,
  ): Promise<CommentResponseDto[]> {
    return this.commentsService.findByPost(postId);
  }

  @Delete(':postId/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Request() req: any,
  ): Promise<void> {
    return this.commentsService.remove(commentId, req.user.id);
  }
}
