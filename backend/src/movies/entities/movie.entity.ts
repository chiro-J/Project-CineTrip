import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';
import { Location } from '../../locations/entities/location.entity';
import { Checklist } from '../../llm/entities/checklist.entity';

@Entity('movies')
export class Movie {
  @PrimaryColumn({ type: 'bigint' })
  tmdb_id: number;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.movie)
  bookmarks: Bookmark[];

  @OneToMany(() => Location, (location) => location.movie)
  locations: Location[];

  @OneToMany(() => Checklist, (checklist) => checklist.movie)
  checklists: Checklist[];
}
