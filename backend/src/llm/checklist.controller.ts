import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Post,
  Body,
} from '@nestjs/common';
import { ChecklistService } from './checklist.service';

interface TravelSchedule {
  startDate: string;
  endDate: string;
  destinations: string[];
}

@Controller('checklist')
export class ChecklistController {
  constructor(private checklistService: ChecklistService) {}

  @Post('generate')
  async generateChecklist(
    @Body()
    body: {
      tmdbId: number;
      travelSchedule: TravelSchedule;
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

  @Get('generate')
  async generateChecklistSimple(
    @Query('tmdbId') tmdbId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('destinations') destinations: string,
    @Query('movieTitle') movieTitle?: string,
  ) {
    if (!tmdbId) {
      throw new BadRequestException('tmdbId는 필수 파라미터입니다.');
    }

    if (!startDate || !endDate) {
      throw new BadRequestException(
        '여행 일정(startDate, endDate)은 필수입니다.',
      );
    }

    if (!destinations) {
      throw new BadRequestException('여행지 목록은 필수입니다.');
    }

    const tmdbIdNumber = parseInt(tmdbId, 10);
    if (isNaN(tmdbIdNumber)) {
      throw new BadRequestException('tmdbId는 유효한 숫자여야 합니다.');
    }

    const destinationsArray = destinations.split(',').map((d) => d.trim());

    const travelSchedule: TravelSchedule = {
      startDate,
      endDate,
      destinations: destinationsArray,
    };

    return this.checklistService.generateChecklist(
      tmdbIdNumber,
      travelSchedule,
      movieTitle,
    );
  }
}
