import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LlmService } from './llm.service';
import { Checklist } from './entities/checklist.entity';
import { Location } from '../locations/entities/location.entity';

interface TravelSchedule {
  startDate: string;
  endDate: string;
  destinations: string[];
}

@Injectable()
export class ChecklistService {
  constructor(
    private llmService: LlmService,
    @InjectRepository(Checklist)
    private checklistRepository: Repository<Checklist>,
    @InjectRepository(Location)
    private sceneLocationRepository: Repository<Location>,
  ) {}

  async generateChecklist(
    tmdbId: number,
    travelSchedule: TravelSchedule,
    movieTitle?: string,
    userId?: string,
  ) {
    try {
      // DB에서 해당 영화의 촬영지 정보 가져오기
      let sceneLocations = await this.sceneLocationRepository.find({
        where: { tmdb_id: tmdbId },
        order: { id: 'ASC' },
        take: 5,
      });

      // 촬영지 정보가 없으면 자동으로 생성
      if (sceneLocations.length === 0) {
        console.log(`촬영지 정보가 없어서 자동 생성합니다. tmdbId: ${tmdbId}`);

        // LLM 서비스를 통해 촬영지 생성
        const generated = await this.llmService.generateSceneLocations({
          tmdbId,
        });
        const items = generated.items.slice(0, 5);

        // 생성된 촬영지들을 DB에 저장
        for (const item of items) {
          const existing = await this.sceneLocationRepository.findOne({
            where: {
              tmdb_id: tmdbId,
              location_name: item.name,
              latitude: item.lat,
              longitude: item.lng,
            },
          });

          if (!existing) {
            await this.sceneLocationRepository.save({
              tmdb_id: tmdbId,
              location_name: item.name,
              scene_description: item.scene,
              timestamp: item.timestamp ?? undefined,
              address: item.address,
              country: item.country,
              city: item.city,
              latitude: item.lat,
              longitude: item.lng,
            });
          }
        }

        // 저장된 촬영지 정보 다시 조회
        sceneLocations = await this.sceneLocationRepository.find({
          where: { tmdb_id: tmdbId },
          order: { id: 'ASC' },
          take: 5,
        });
      }

      // 데이터베이스 엔티티를 LLM 서비스가 기대하는 형식으로 변환
      const formattedSceneLocations = sceneLocations.map((location) => ({
        id: location.id,
        name: location.location_name,
        scene: location.scene_description,
        // timestamp: location.timestamp, // timestamp 필드가 Location 엔티티에 없음
        address: location.address,
        country: location.country,
        city: location.city,
        lat: Number(location.latitude),
        lng: Number(location.longitude),
      }));

      const result = await this.llmService.generateChecklist({
        tmdbId,
        movieTitle,
        sceneLocations: formattedSceneLocations,
        travelSchedule,
      });

      // 체크리스트를 DB에 저장
      const checklistData = {
        tmdbId,
        movieTitle,
        userId: userId || undefined,
        travelSchedule,
        items: result.items,
        notes: '',
      };

      const savedChecklist = await this.checklistRepository.save(
        checklistData as any,
      );

      return {
        success: true,
        data: result.items,
        checklistId: savedChecklist?.id,
        message: '체크리스트가 성공적으로 생성되고 저장되었습니다.',
      };
    } catch (error) {
      console.error('체크리스트 생성 중 오류:', error);
      throw new ServiceUnavailableException('체크리스트 생성에 실패했습니다.');
    }
  }

  async getChecklistsByUser(userId: number): Promise<Checklist[]> {
    return this.checklistRepository.find({
      where: { user_id: userId },
    });
  }

  async getChecklistById(id: number): Promise<Checklist | null> {
    return this.checklistRepository.findOne({ where: { id } });
  }
}
