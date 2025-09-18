import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { AuthModule } from '../auth/auth.module';
import { Post } from './entities/post.entity';
import { Like } from './likes/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Like]),
    CommentsModule,
    LikesModule,
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}