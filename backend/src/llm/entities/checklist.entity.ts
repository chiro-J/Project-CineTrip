import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Movie } from '../../movies/entities/movie.entity';

@Entity('checklists')
@Index(['tmdb_id', 'user_id'], { unique: false })
export class Checklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  tmdb_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  movie_title: string;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'json' })
  travel_schedule: {
    startDate: string;
    endDate: string;
    destinations: string[];
  };

  @Column({ type: 'json' })
  items: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
    location?: {
      name: string;
      address: string;
      lat: number;
      lng: number;
    };
  }>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  movie: Movie;
}
