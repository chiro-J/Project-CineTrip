import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { LlmService } from './llm.service';
import { SceneLocationsService } from '../locations/locations.service';
import { ChecklistService } from './checklist.service';

@Controller('llm')
export class LlmController {
  constructor(
    private readonly llmService: LlmService,
    private readonly sceneLocationsService: SceneLocationsService,
    private readonly checklistService: ChecklistService,
  ) {}

  @Post('scenes')
  async generateScenes(@Body() body: { tmdbId: number }) {
    if (!body.tmdbId || typeof body.tmdbId !== 'number') {
      throw new BadRequestException('tmdbId는 숫자여야 합니다.');
    }

    return await this.llmService.generateSceneLocations({
      tmdbId: body.tmdbId,
    });
  }

  @Get('scenes/:tmdbId')
  async getScenes(
    @Param('tmdbId') tmdbId: string,
    @Query('regen') regen?: string,
    @Query('title') title?: string,
    @Query('originalTitle') originalTitle?: string,
    @Query('country') country?: string,
    @Query('language') language?: string,
  ) {
    const movieId = parseInt(tmdbId);
    if (isNaN(movieId)) {
      throw new BadRequestException('유효하지 않은 영화 ID입니다.');
    }

    // 프론트엔드에서 전달받은 영화 정보 사용
    const movieInfo = {
      title: title || undefined,
      original_title: originalTitle || undefined,
      country: country || undefined,
      language: language || undefined,
    };

    const items = await this.sceneLocationsService.getOrGenerateByTmdb(
      movieId,
      {
        regen: regen === 'true',
        movieInfo,
      },
    );

    return { items };
  }

  @Post('prompt')
  async generateChecklist(
    @Body()
    body: {
      tmdbId: number;
      travelSchedule: {
        startDate: string;
        endDate: string;
        destinations: string[];
      };
      movieTitle?: string;
    },
  ) {
    const { tmdbId, travelSchedule, movieTitle } = body;

    // 간단한 검증
    if (!tmdbId || typeof tmdbId !== 'number') {
      throw new BadRequestException('tmdbId는 숫자여야 합니다.');
    }

    if (
      !travelSchedule ||
      !travelSchedule.startDate ||
      !travelSchedule.endDate
    ) {
      throw new BadRequestException(
        '여행 일정(startDate, endDate)은 필수입니다.',
      );
    }

    if (
      !travelSchedule.destinations ||
      travelSchedule.destinations.length === 0
    ) {
      throw new BadRequestException('여행지 목록은 필수입니다.');
    }

    return this.checklistService.generateChecklist(
      tmdbId,
      travelSchedule,
      movieTitle,
    );
  }
}
