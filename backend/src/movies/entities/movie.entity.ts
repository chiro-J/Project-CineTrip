import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';
import { Location } from '../../locations/entities/location.entity';

@Entity('movies')
export class Movie {
  @PrimaryColumn('bigint')
  tmdbId: number;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  overview: string;

  @Column({ nullable: true })
  posterPath: string;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @OneToMany(() => Bookmark, bookmark => bookmark.movie)
  bookmarks: Bookmark[];

  @OneToMany(() => Location, location => location.movie)
  locations: Location[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}