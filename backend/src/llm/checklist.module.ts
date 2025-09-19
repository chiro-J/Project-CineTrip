import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { LlmService } from './llm.service';
import { SceneLocation } from '../locations/entities/location.entity';
import { Checklist } from './entities/checklist.entity';
import { Bookmark } from '../movies/bookmarks/entities/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SceneLocation, Bookmark, Checklist])],
  controllers: [ChecklistController],
  providers: [ChecklistService, LlmService],
  exports: [ChecklistService],
})
export class ChecklistModule {}
