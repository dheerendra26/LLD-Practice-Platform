import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SaveSubmissionDto } from './dto/save-submission.dto.js';
import { SubmissionsService } from './submissions.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { type JwtPayload } from '../auth/auth.types.js';

@ApiTags('Submissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attempts/:attemptId/submission')
export class SubmissionsController {
  constructor(
    private readonly submissionsService: SubmissionsService,
  ) {}

  @Put()
  save(
    @Param('attemptId') attemptId: string,
    @Body() saveSubmissionDto: SaveSubmissionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.submissionsService.save(
      attemptId,
      user.sub,
      saveSubmissionDto,
    );
  }

  @Get()
  findByAttemptId(
    @Param('attemptId') attemptId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.submissionsService.findByAttemptId(
      attemptId,
      user.sub,
    );
  }
}