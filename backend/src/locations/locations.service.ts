import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { TypeOrmService } from '../database/typeorm.service';
import { LlmService } from '../llm/llm.service';
import { SceneLocation } from '../llm/entities/scene-location.entity';

@Injectable()
export class SceneLocationsService {
  constructor(
    private typeOrm: TypeOrmService,
    private llm: LlmService,
  ) {}

  async getOrGenerateByTmdb(
    tmdbId: number,
    opts: { regen?: boolean; movieInfo?: any },
  ) {
    // regen=false이면 DB 먼저 조회
    if (!opts.regen) {
      const rows = await this.typeOrm.findSceneLocationsByTmdbId(tmdbId);
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
      await this.typeOrm.deleteSceneLocationsByTmdbId(tmdbId);
    }

    // 새 데이터 저장
    for (const it of items) {
      const existing = await this.typeOrm.findSceneLocationByUniqueKey(
        tmdbId,
        it.name,
        it.lat,
        it.lng,
      );

      if (existing) {
        // 기존 데이터 업데이트
        await this.typeOrm.saveSceneLocation({
          id: existing.id,
          scene: it.scene,
          timestamp: it.timestamp ?? undefined,
          address: it.address,
          country: it.country,
          city: it.city,
        });
      } else {
        // 새 데이터 생성
        await this.typeOrm.saveSceneLocation({
          tmdbId,
          name: it.name,
          scene: it.scene,
          timestamp: it.timestamp ?? undefined,
          address: it.address,
          country: it.country,
          city: it.city,
          lat: it.lat,
          lng: it.lng,
        });
      }
    }

    // 혹여 5개 초과 잔존 시 정리
    const all = await this.typeOrm.findSceneLocationsByTmdbIdOrdered(tmdbId);
    if (all.length > 5) {
      const toDelete = all.slice(5).map((r) => r.id);
      await this.typeOrm.deleteSceneLocationsByIds(toDelete);
    }

    const saved = await this.typeOrm.findSceneLocationsByTmdbId(tmdbId);
    return saved.map(this.toDto);
  }

  // TypeORM 엔티티 → 응답 DTO 변환
  private toDto = (r: SceneLocation) => ({
    id: r.id,
    name: r.name,
    scene: r.scene,
    timestamp: r.timestamp ?? undefined,
    address: r.address,
    country: r.country,
    city: r.city,
    lat: Number(r.lat), // Decimal → number
    lng: Number(r.lng), // Decimal → number
  });
}
