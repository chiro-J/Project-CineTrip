import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('scene_locations')
@Index(['tmdbId', 'location_name', 'latitude', 'longitude'], { unique: true })
export class SceneLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  tmdbId: number;

  @Column({ type: 'varchar', length: 255 })
  location_name: string;

  @Column({ type: 'text' })
  scene_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timestamp: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;
}
