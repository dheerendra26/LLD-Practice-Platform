import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { Attempt } from '../../attempts/entities/attempt.entity.js';

export enum EvaluationStatus {
  PENDING = 'PENDING',
  EVALUATING = 'EVALUATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  attemptId: string;

  @OneToOne('Attempt', 'evaluation', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attemptId' })
  attempt: Attempt;

  @Column({
    type: 'enum',
    enum: EvaluationStatus,
    default: EvaluationStatus.PENDING,
  })
  status: EvaluationStatus;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  overallScore?: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  summary?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
