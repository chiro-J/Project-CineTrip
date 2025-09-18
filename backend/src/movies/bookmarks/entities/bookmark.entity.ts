import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Movie } from '../../entities/movie.entity';

@Entity('bookmarks')
@Unique(['userId', 'tmdbId'])
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('bigint')
  tmdbId: number;

  @ManyToOne(() => User, user => user.bookmarks, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Movie, movie => movie.bookmarks, { onDelete: 'CASCADE' })
  movie: Movie;

  @CreateDateColumn()
  createdAt: Date;
}