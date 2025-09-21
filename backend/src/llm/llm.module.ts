import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import { LocationsService } from '../locations/locations.service';
import { ChecklistService } from './checklist.service';
import { Location } from '../locations/entities/location.entity';
import { Checklist } from './entities/checklist.entity';
import { Bookmark } from '../movies/bookmarks/entities/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Bookmark, Checklist])],
  controllers: [LlmController],
  providers: [LlmService, LocationsService, ChecklistService],
  exports: [LlmService],
})
export class LlmModule {}
