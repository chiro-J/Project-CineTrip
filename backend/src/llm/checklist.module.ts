import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { LlmService } from './llm.service';
import { Location } from '../locations/entities/location.entity';
import { Checklist } from './entities/checklist.entity';
import { Bookmark } from '../movies/bookmarks/entities/bookmark.entity';
import { Movie } from '../movies/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Bookmark, Checklist, Movie])],
  controllers: [ChecklistController],
  providers: [ChecklistService, LlmService],
  exports: [ChecklistService],
})
export class ChecklistModule {}
