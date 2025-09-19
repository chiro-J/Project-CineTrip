import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LlmService } from './llm.service';
import { Checklist } from './entities/checklist.entity';
import { SceneLocation } from '../locations/entities/location.entity';

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
    @InjectRepository(SceneLocation)
    private sceneLocationRepository: Repository<SceneLocation>,
  ) {}

  async generateChecklist(
    tmdbId: number,
    travelSchedule: TravelSchedule,
    movieTitle?: string,
    userId?: string,
  ) {
    try {
      // DB에서 해당 영화의 촬영지 정보 가져오기
      const sceneLocations = await this.sceneLocationRepository.find({
        where: { tmdbId },
        order: { id: 'ASC' },
        take: 5,
      });

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

  async getChecklistsByUser(userId: string): Promise<Checklist[]> {
    return this.checklistRepository.find({
      where: { userId },
    });
  }

  async getChecklistById(id: number): Promise<Checklist | null> {
    return this.checklistRepository.findOne({ where: { id } });
  }
}
