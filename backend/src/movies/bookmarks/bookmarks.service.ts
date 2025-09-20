import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  async addBookmark(userId: number, tmdbId: number): Promise<Bookmark> {
    // 이미 북마크되어 있는지 확인
    const isAlreadyBookmarked = await this.isBookmarked(userId, tmdbId);

    if (isAlreadyBookmarked) {
      throw new ConflictException('이미 북마크된 영화입니다.');
    }

    const bookmark = this.bookmarkRepository.create({
      user_id: userId,
      tmdb_id: tmdbId,
    });
    return await this.bookmarkRepository.save(bookmark);
  }

  async removeBookmark(userId: number, tmdbId: number): Promise<void> {
    const isBookmarked = await this.isBookmarked(userId, tmdbId);

    if (!isBookmarked) {
      throw new NotFoundException('북마크를 찾을 수 없습니다.');
    }

    const bookmark = await this.bookmarkRepository.findOne({
      where: { user_id: userId, tmdb_id: tmdbId },
    });
    if (bookmark) {
      await this.bookmarkRepository.remove(bookmark);
    }
  }

  async getUserBookmarks(userId: number): Promise<Bookmark[]> {
    return await this.bookmarkRepository.find({
      where: { user_id: userId },
    });
  }

  async isBookmarked(userId: number, tmdbId: number): Promise<boolean> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { user_id: userId, tmdb_id: tmdbId },
    });
    return !!bookmark;
  }

  async toggleBookmark(
    userId: number,
    tmdbId: number,
  ): Promise<{ isBookmarked: boolean; bookmark?: Bookmark }> {
    const existingBookmark = await this.bookmarkRepository.findOne({
      where: { user_id: userId, tmdb_id: tmdbId },
    });

    if (existingBookmark) {
      await this.removeBookmark(userId, tmdbId);
      return { isBookmarked: false };
    } else {
      const bookmark = await this.addBookmark(userId, tmdbId);
      return { isBookmarked: true, bookmark };
    }
  }
}
