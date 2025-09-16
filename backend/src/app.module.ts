import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MoviesModule } from './modules/movies/movies.module';
import { LocationsModule } from './modules/locations/locations.module';
import { PhotosModule } from './modules/photos/photos.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { FeedModule } from './modules/feed/feed.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { SearchModule } from './modules/search/search.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UsersModule, MoviesModule, LocationsModule, PhotosModule, CommentsModule, ChecklistModule, RecommendationsModule, FeedModule, GalleryModule, SearchModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
