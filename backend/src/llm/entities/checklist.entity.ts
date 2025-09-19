import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('checklists')
@Index(['tmdbId', 'userId'], { unique: false })
export class Checklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  tmdbId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  movieTitle: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userId: string;

  @Column({ type: 'json' })
  travelSchedule: {
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
}
