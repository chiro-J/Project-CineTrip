import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';

@Entity('locations')
@Index(['tmdb_id', 'location_name', 'latitude', 'longitude'], { unique: true })
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  tmdb_id: number;

  @Column({ type: 'varchar', length: 255 })
  location_name: string;

  @Column({ type: 'text', nullable: true })
  scene_description: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  movie: Movie;
}
