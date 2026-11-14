import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Problem } from '../../problems/entities/problem.entity.js';
import { User } from '../../auth/entities/user.entity.js';
import type { Submission } from '../../submissions/entities/submission.entity.js';
import type { Evaluation } from '../../evaluations/entities/evaluation.entity.js';

export enum AttemptStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  EVALUATING = 'EVALUATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('attempts')
export class Attempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Problem, {
    eager: true,
    onDelete: 'CASCADE',
  })
  problem: Problem;

  @Column()
  problemId: string;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @Column({
    type: 'enum',
    enum: AttemptStatus,
    default: AttemptStatus.DRAFT,
  })
  status: AttemptStatus;

  @OneToOne('Submission', 'attempt')
  submission?: Submission;

  @OneToOne('Evaluation', 'attempt')
  evaluation?: Evaluation;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  submittedAt?: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
