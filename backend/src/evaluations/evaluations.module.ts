import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module.js';
import { AttemptsModule } from '../attempts/attempts.module.js';
import { SubmissionsModule } from '../submissions/submissions.module.js';
import { FeedbackItem } from './entities/feedback-item.entity.js';
import { Evaluation } from './entities/evaluation.entity.js';
import { EvaluationsController } from './evaluations.controller.js';
import { EvaluationsService } from './evaluations.service.js';
import { GeminiEvaluationStrategy } from './strategies/gemini-evaluation.strategy.js';
import { Attempt } from '../attempts/entities/attempt.entity.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation, FeedbackItem, Attempt]),
    AuthModule,
    AttemptsModule,
    SubmissionsModule,
  ],
  controllers: [EvaluationsController],
  providers: [EvaluationsService, GeminiEvaluationStrategy, JwtAuthGuard],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}
