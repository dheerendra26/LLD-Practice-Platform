import { Problem } from '../../problems/entities/problem.entity.js';
import { Submission } from '../../submissions/entities/submission.entity.js';
import { EvaluationFeedbackDto } from '../dto/evaluation-feedback.dto.js';

export interface EvaluationStrategy {
  evaluate(
    problem: Problem,
    submission: Submission,
  ): Promise<EvaluationFeedbackDto>;
}