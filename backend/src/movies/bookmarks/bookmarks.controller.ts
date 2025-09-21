import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Query,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('user')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  // 인증 필요: 본인의 북마크 관리
  @Post('me/bookmarks')
  @UseGuards(JwtAuthGuard)
  async addBookmark(
    @Body()
    body: {
      tmdbId: number;
    },
    @Request() req: any,
  ) {
    const { tmdbId } = body;

    if (!tmdbId) {
      throw new BadRequestException('tmdbId는 필수입니다.');
    }

    const userId = req.user.id;
    return await this.bookmarksService.addBookmark(userId, tmdbId);
  }

  @Get('me/bookmarks')
  @UseGuards(JwtAuthGuard)
  async getMyBookmarks(@Request() req: any) {
    const userId = req.user.id;
    return await this.bookmarksService.getUserBookmarks(userId);
  }

  @Delete('me/bookmarks/:movieId')
  @UseGuards(JwtAuthGuard)
  async removeMyBookmark(
    @Param('movieId') movieId: string,
    @Request() req: any,
  ) {
    const tmdbId = parseInt(movieId);
    if (isNaN(tmdbId)) {
      throw new BadRequestException('movieId는 유효한 숫자여야 합니다.');
    }

    const userId = req.user.id;
    await this.bookmarksService.removeBookmark(userId, tmdbId);
    return { message: '북마크가 제거되었습니다.' };
  }

  @Post('me/toggle')
  @UseGuards(JwtAuthGuard)
  async toggleMyBookmark(
    @Body()
    body: {
      tmdbId: number;
    },
    @Request() req: any,
  ) {
    const { tmdbId } = body;

    if (!tmdbId) {
      throw new BadRequestException('tmdbId는 필수입니다.');
    }

    const userId = parseInt(req.user.id);
    return await this.bookmarksService.toggleBookmark(userId, tmdbId);
  }

  @Get('me/check')
  @UseGuards(JwtAuthGuard)
  async isMyBookmarked(@Query('tmdbId') tmdbId: string, @Request() req: any) {
    if (!tmdbId) {
      throw new BadRequestException('tmdbId는 필수입니다.');
    }

    const tmdbIdNumber = parseInt(tmdbId);
    if (isNaN(tmdbIdNumber)) {
      throw new BadRequestException('tmdbId는 유효한 숫자여야 합니다.');
    }

    const userId = parseInt(req.user.id);
    const isBookmarked = await this.bookmarksService.isBookmarked(
      userId,
      tmdbIdNumber,
    );
    return { isBookmarked };
  }

  // 인증 불필요: 다른 사용자의 북마크 조회 (갤러리용)
  @Get(':userId/bookmarks')
  async getUserBookmarks(@Param('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId는 필수입니다.');
    }

    return await this.bookmarksService.getUserBookmarks(parseInt(userId));
  }
}
