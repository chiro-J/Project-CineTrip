import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, ManyToOne } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Movie } from '../../entities/movie.entity';

@Entity('bookmarks')
@Unique(['user_id', 'tmdb_id'])
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  tmdb_id: number;

  @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  movie: Movie;

  @CreateDateColumn()
  created_at: Date;
}
