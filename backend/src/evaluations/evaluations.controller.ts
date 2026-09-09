import {
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EvaluationsService } from './evaluations.service.js';

@ApiTags('Evaluations')
@Controller('attempts/:attemptId/evaluation')
export class EvaluationsController {
  constructor(
    private readonly evaluationsService: EvaluationsService,
  ) {}

  @Post()
  create(@Param('attemptId') attemptId: string) {
    return this.evaluationsService.createEvaluation(attemptId);
  }

  @Post('retry')
  retry(@Param('attemptId') attemptId: string) {
    return this.evaluationsService.retryEvaluation(attemptId);
  }

  @Get()
  findByAttemptId(
    @Param('attemptId') attemptId: string,
  ) {
    return this.evaluationsService.findByAttemptId(attemptId);
  }
}