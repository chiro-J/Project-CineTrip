import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SceneLocation } from '../entities/scene-location.entity';

@Injectable()
export class TypeOrmService {
  constructor(
    @InjectRepository(SceneLocation)
    private sceneLocationRepository: Repository<SceneLocation>,
  ) {}

  async findSceneLocationsByTmdbId(tmdbId: number): Promise<SceneLocation[]> {
    return this.sceneLocationRepository.find({
      where: { tmdbId },
      order: { id: 'ASC' },
      take: 5,
    });
  }

  async deleteSceneLocationsByTmdbId(tmdbId: number): Promise<void> {
    await this.sceneLocationRepository.delete({ tmdbId });
  }

  async saveSceneLocation(sceneLocation: Partial<SceneLocation>): Promise<SceneLocation> {
    return this.sceneLocationRepository.save(sceneLocation);
  }

  async findSceneLocationByUniqueKey(
    tmdbId: number,
    name: string,
    lat: number,
    lng: number,
  ): Promise<SceneLocation | null> {
    return this.sceneLocationRepository.findOne({
      where: { tmdbId, name, lat, lng },
    });
  }

  async findSceneLocationsByTmdbIdOrdered(tmdbId: number): Promise<SceneLocation[]> {
    return this.sceneLocationRepository.find({
      where: { tmdbId },
      order: { id: 'ASC' },
    });
  }

  async deleteSceneLocationsByIds(ids: number[]): Promise<void> {
    await this.sceneLocationRepository.delete(ids);
  }
}
