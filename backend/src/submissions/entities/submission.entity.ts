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

export enum SubmissionType {
  TEXT = 'TEXT',
}

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  attemptId: string;

  @OneToOne('Attempt', 'submission', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attemptId' })
  attempt: Attempt;

  @Column({
    type: 'enum',
    enum: SubmissionType,
    default: SubmissionType.TEXT,
  })
  type: SubmissionType;

  @Column({ type: 'text', nullable: true })
  assumptions?: string;

  @Column({ type: 'text', nullable: true })
  coreClasses?: string;

  @Column({ type: 'text', nullable: true })
  responsibilities?: string;

  @Column({ type: 'text', nullable: true })
  relationships?: string;

  @Column({ type: 'text', nullable: true })
  abstractions?: string;

  @Column({ type: 'text', nullable: true })
  designDecisions?: string;

  @Column({ type: 'text', nullable: true })
  extensibility?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
