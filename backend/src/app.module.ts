import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController, HealthController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MoviesModule } from './movies/movies.module';
import { LocationsModule } from './locations/locations.module';
import { LlmModule } from './llm/llm.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PostsModule,
    MoviesModule,
    LocationsModule,
    LlmModule,
    UploadModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
