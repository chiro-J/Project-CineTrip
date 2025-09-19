import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';
import { SceneLocationsService } from './locations.service';
import { LlmModule } from '../llm/llm.module';
import { SceneLocation } from './entities/location.entity';

@Module({
  imports: [LlmModule, TypeOrmModule.forFeature([SceneLocation])],
  controllers: [LocationsController],
  providers: [SceneLocationsService],
})
export class LocationsModule {}
