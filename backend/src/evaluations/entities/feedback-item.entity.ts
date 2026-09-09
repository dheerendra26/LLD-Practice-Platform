import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Evaluation } from './evaluation.entity.js';

@Entity('feedback_items')
export class FeedbackItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  criterion: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({ type: 'jsonb', default: [] })
  evidence: string[];

  @Column({ type: 'jsonb', default: [] })
  concerns: string[];

  @Column({ type: 'text' })
  suggestion: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  confidence?: number;

  @ManyToOne(() => Evaluation, {
    onDelete: 'CASCADE',
  })
  evaluation: Evaluation;
}