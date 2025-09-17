import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import { SceneLocationsService } from '../locations/locations.service';
import { TypeOrmService } from '../database/typeorm.service';
import { SceneLocation } from '../entities/scene-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SceneLocation])],
  controllers: [LlmController],
  providers: [LlmService, SceneLocationsService, TypeOrmService],
  exports: [LlmService],
})
export class LlmModule {}
