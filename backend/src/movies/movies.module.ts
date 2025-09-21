import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), BookmarksModule],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService, BookmarksModule],
})
export class MoviesModule {}
