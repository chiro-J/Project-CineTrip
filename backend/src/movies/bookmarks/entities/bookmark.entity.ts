import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bookmarks')
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  tmdbId: number;
}
