import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MoviesModule } from './movies/movies.module';
import { LocationsModule } from './locations/locations.module';
import { LlmModule } from './llm/llm.module';
import { ChecklistModule } from './llm/checklist.module';
import { UploadModule } from './upload/upload.module';
import { SceneLocation } from './llm/entities/scene-location.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: process.env.DB_DATABASE ?? 'cinetrip',
      entities: [SceneLocation],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    MoviesModule,
    LocationsModule,
    LlmModule,
    ChecklistModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
