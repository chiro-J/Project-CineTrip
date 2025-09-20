import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async createMovie(tmdbId: number): Promise<Movie> {
    const existingMovie = await this.movieRepository.findOne({
      where: { tmdb_id: tmdbId },
    });

    if (existingMovie) {
      return existingMovie;
    }

    const movie = this.movieRepository.create({ tmdb_id: tmdbId });
    return this.movieRepository.save(movie);
  }

  async getMovie(tmdbId: number): Promise<Movie | null> {
    return this.movieRepository.findOne({
      where: { tmdb_id: tmdbId },
    });
  }
}
