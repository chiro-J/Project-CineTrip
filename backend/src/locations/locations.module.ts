import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { LlmModule } from '../llm/llm.module';
import { Location } from './entities/location.entity';
import { Movie } from '../movies/entities/movie.entity';

@Module({
  imports: [LlmModule, TypeOrmModule.forFeature([Location, Movie])],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
