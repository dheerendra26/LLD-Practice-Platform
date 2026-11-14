import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attempt, AttemptStatus } from '../attempts/entities/attempt.entity.js';
import { AttemptsService } from '../attempts/attempts.service.js';
import { FeedbackItem } from './entities/feedback-item.entity.js';
import { Evaluation, EvaluationStatus } from './entities/evaluation.entity.js';
import { GeminiEvaluationStrategy } from './strategies/gemini-evaluation.strategy.js';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationsRepository: Repository<Evaluation>,

    @InjectRepository(FeedbackItem)
    private readonly feedbackItemsRepository: Repository<FeedbackItem>,

    @InjectRepository(Attempt)
    private readonly attemptsRepository: Repository<Attempt>,

    private readonly attemptsService: AttemptsService,

    private readonly geminiEvaluationStrategy: GeminiEvaluationStrategy,
  ) {}

  async createEvaluation(attemptId: string, userId: string) {
    const attempt = await this.attemptsService.findOne(attemptId, userId);

    const existingEvaluation = await this.evaluationsRepository.findOneBy({
      attemptId,
    });

    if (existingEvaluation) {
      return this.processEvaluation(existingEvaluation, attempt, userId);
    }

    attempt.status = AttemptStatus.SUBMITTED;
    attempt.submittedAt = new Date();

    await this.attemptsRepository.save(attempt);

    const evaluation = this.evaluationsRepository.create({
      attemptId,
      status: EvaluationStatus.PENDING,
    });

    const savedEvaluation = await this.evaluationsRepository.save(evaluation);

    return this.processEvaluation(savedEvaluation, attempt, userId);
  }

  private async processEvaluation(
    evaluation: Evaluation,
    attempt: Attempt,
    userId: string,
  ) {
    try {
      evaluation.status = EvaluationStatus.EVALUATING;

      await this.evaluationsRepository.save(evaluation);

      attempt.status = AttemptStatus.EVALUATING;

      await this.attemptsRepository.save(attempt);

      const attemptWithSubmission = await this.attemptsRepository.findOne({
        where: {
          id: attempt.id,
        },
        relations: {
          submission: true,
          problem: true,
        },
      });

      if (!attemptWithSubmission || !attemptWithSubmission.submission) {
        throw new NotFoundException('Submission not found');
      }

      const submission = attemptWithSubmission.submission;
      const problem = attemptWithSubmission.problem;

      const result = await this.geminiEvaluationStrategy.evaluate(
        problem,
        submission,
      );

      evaluation.overallScore = result.overallScore;
      evaluation.summary = result.summary;
      evaluation.errorMessage = undefined;
      evaluation.status = EvaluationStatus.COMPLETED;

      await this.evaluationsRepository.save(evaluation);

      await this.feedbackItemsRepository.delete({
        evaluation: {
          id: evaluation.id,
        },
      });

      const feedbackItems = result.feedback.map((item) =>
        this.feedbackItemsRepository.create({
          criterion: item.criterion,
          score: item.score,
          evidence: item.evidence,
          concerns: item.concerns,
          suggestion: item.suggestion,
          confidence: item.confidence,
          evaluation,
        }),
      );

      await this.feedbackItemsRepository.save(feedbackItems);

      attempt.status = AttemptStatus.COMPLETED;

      await this.attemptsRepository.save(attempt);

      return this.findByAttemptId(attempt.id, userId);
    } catch (error) {
      evaluation.status = EvaluationStatus.FAILED;

      evaluation.errorMessage =
        error instanceof Error ? error.message : 'Evaluation failed';

      await this.evaluationsRepository.save(evaluation);

      attempt.status = AttemptStatus.FAILED;

      await this.attemptsRepository.save(attempt);

      throw error;
    }
  }

  async findByAttemptId(attemptId: string, userId: string) {
    await this.attemptsService.findOne(attemptId, userId);

    const evaluation = await this.evaluationsRepository.findOne({
      where: {
        attemptId,
      },
      relations: {
        attempt: true,
      },
    });

    if (!evaluation) {
      throw new NotFoundException('Evaluation not found');
    }

    const feedback = await this.feedbackItemsRepository.find({
      where: {
        evaluation: {
          id: evaluation.id,
        },
      },
    });

    return {
      ...evaluation,
      feedback,
    };
  }

  async retryEvaluation(attemptId: string, userId: string) {
    const attempt = await this.attemptsService.findOne(attemptId, userId);

    const evaluation = await this.evaluationsRepository.findOneBy({
      attemptId,
    });

    if (!evaluation) {
      return this.createEvaluation(attemptId, userId);
    }

    evaluation.status = EvaluationStatus.PENDING;
    evaluation.errorMessage = undefined;

    await this.evaluationsRepository.save(evaluation);

    return this.processEvaluation(evaluation, attempt, userId);
  }
}
