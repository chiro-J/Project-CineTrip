import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { LlmService } from './llm.service';
import { TypeOrmService } from '../database/typeorm.service';
import { SceneLocation } from './entities/scene-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SceneLocation])],
  controllers: [ChecklistController],
  providers: [ChecklistService, LlmService, TypeOrmService],
  exports: [ChecklistService],
})
export class ChecklistModule {}
