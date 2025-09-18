import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { LlmService } from './llm.service';
import { TypeOrmService } from '../database/typeorm.service';

interface TravelSchedule {
  startDate: string;
  endDate: string;
  destinations: string[];
}

@Injectable()
export class ChecklistService {
  constructor(
    private llmService: LlmService,
    private typeOrmService: TypeOrmService,
  ) {}

  async generateChecklist(
    tmdbId: number,
    travelSchedule: TravelSchedule,
    movieTitle?: string,
  ) {
    try {
      // DB에서 해당 영화의 촬영지 정보 가져오기
      const sceneLocations =
        await this.typeOrmService.findSceneLocationsByTmdbId(tmdbId);

      if (sceneLocations.length === 0) {
        throw new ServiceUnavailableException(
          '해당 영화의 촬영지 정보가 없습니다. 먼저 촬영지를 생성해주세요.',
        );
      }

      const result = await this.llmService.generateChecklist({
        tmdbId,
        movieTitle,
        sceneLocations,
        travelSchedule,
      });

      return {
        success: true,
        data: result.items,
        message: '체크리스트가 성공적으로 생성되었습니다.',
      };
    } catch (error) {
      console.error('체크리스트 생성 중 오류:', error);
      throw new ServiceUnavailableException('체크리스트 생성에 실패했습니다.');
    }
  }
}
