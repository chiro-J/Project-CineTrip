import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LlmService } from '../llm/llm.service';
import { SceneLocation } from './entities/location.entity';

@Injectable()
export class SceneLocationsService {
  constructor(
    @InjectRepository(SceneLocation)
    private sceneLocationRepository: Repository<SceneLocation>,
    private llm: LlmService,
  ) {}

  async getOrGenerateByTmdb(
    tmdbId: number,
    opts: { regen?: boolean; movieInfo?: any },
  ) {
    // regen=false이면 DB 먼저 조회
    if (!opts.regen) {
      const rows = await this.sceneLocationRepository.find({
        where: { tmdbId },
        order: { id: 'ASC' },
        take: 5,
      });
      if (rows.length > 0) {
        return rows.map(this.toDto);
      }
    }

    // 없거나 강제재생성 → LLM
    const generated = await this.llm
      .generateSceneLocations({ tmdbId }, opts.movieInfo)
      .catch(() => {
        throw new ServiceUnavailableException('LLM generation failed');
      });

    const items = generated.items.slice(0, 5);

    // 기존 데이터 삭제 (regen=true인 경우)
    if (opts.regen) {
      await this.sceneLocationRepository.delete({ tmdbId });
    }

    // 새 데이터 저장
    for (const it of items) {
      const existing = await this.sceneLocationRepository.findOne({
        where: {
          tmdbId,
          location_name: it.name,
          latitude: it.lat,
          longitude: it.lng,
        },
      });

      if (existing) {
        // 기존 데이터 업데이트
        await this.sceneLocationRepository.save({
          id: existing.id,
          scene_description: it.scene,
          timestamp: it.timestamp ?? undefined,
          address: it.address,
          country: it.country,
          city: it.city,
        });
      } else {
        // 새 데이터 생성
        await this.sceneLocationRepository.save({
          tmdbId,
          location_name: it.name,
          scene_description: it.scene,
          timestamp: it.timestamp ?? undefined,
          address: it.address,
          country: it.country,
          city: it.city,
          latitude: it.lat,
          longitude: it.lng,
        });
      }
    }

    // 혹여 5개 초과 잔존 시 정리
    const all = await this.sceneLocationRepository.find({
      where: { tmdbId },
      order: { id: 'ASC' },
    });
    if (all.length > 5) {
      const toDelete = all.slice(5).map((r) => r.id);
      await this.sceneLocationRepository.delete(toDelete);
    }

    const saved = await this.sceneLocationRepository.find({
      where: { tmdbId },
      order: { id: 'ASC' },
      take: 5,
    });
    return saved.map(this.toDto);
  }

  // TypeORM 엔티티 → 응답 DTO 변환
  private toDto = (r: SceneLocation) => ({
    id: r.id,
    name: r.location_name,
    scene: r.scene_description,
    timestamp: r.timestamp ?? undefined,
    address: r.address,
    country: r.country,
    city: r.city,
    lat: Number(r.latitude), // Decimal → number
    lng: Number(r.longitude), // Decimal → number
  });
}
