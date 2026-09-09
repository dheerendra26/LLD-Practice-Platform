import {
  Body,
  Controller,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SaveSubmissionDto } from './dto/save-submission.dto.js';
import { SubmissionsService } from './submissions.service.js';

@ApiTags('Submissions')
@Controller('attempts/:attemptId/submission')
export class SubmissionsController {
  constructor(
    private readonly submissionsService: SubmissionsService,
  ) {}

  @Put()
  save(
    @Param('attemptId') attemptId: string,
    @Body() saveSubmissionDto: SaveSubmissionDto,
  ) {
    return this.submissionsService.save(
      attemptId,
      saveSubmissionDto,
    );
  }

  @Get()
  findByAttemptId(
    @Param('attemptId') attemptId: string,
  ) {
    return this.submissionsService.findByAttemptId(
      attemptId,
    );
  }
}