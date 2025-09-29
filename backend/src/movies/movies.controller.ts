import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async createMovie(@Body() body: { tmdbId: number }) {
    return this.moviesService.createMovie(body.tmdbId);
  }

  @Get(':tmdbId')
  async getMovie(@Param('tmdbId') tmdbId: string) {
    return this.moviesService.getMovie(parseInt(tmdbId));
  }
}
