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

@Controller('llm')
export class LlmController {
  constructor(
    private readonly llmService: LlmService,
    private readonly sceneLocationsService: SceneLocationsService,
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
}
