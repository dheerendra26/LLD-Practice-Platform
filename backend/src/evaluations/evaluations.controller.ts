import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { EvaluationsService } from './evaluations.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { type JwtPayload } from '../auth/auth.types.js';

@ApiTags('Evaluations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attempts/:attemptId/evaluation')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  create(
    @Param('attemptId') attemptId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.evaluationsService.createEvaluation(attemptId, user.sub);
  }

  @Post('retry')
  retry(
    @Param('attemptId') attemptId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.evaluationsService.retryEvaluation(attemptId, user.sub);
  }

  @Get()
  findByAttemptId(
    @Param('attemptId') attemptId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.evaluationsService.findByAttemptId(attemptId, user.sub);
  }
}
