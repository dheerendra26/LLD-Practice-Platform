import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AttemptsService } from '../attempts/attempts.service.js';
import { SaveSubmissionDto } from './dto/save-submission.dto.js';
import { Submission } from './entities/submission.entity.js';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,

    private readonly attemptsService: AttemptsService,
  ) {}

  async save(
    attemptId: string,
    userId: string,
    saveSubmissionDto: SaveSubmissionDto,
  ) {
    await this.attemptsService.findOne(attemptId, userId);

    let submission = await this.submissionsRepository.findOneBy({
      attemptId,
    });

    if (submission) {
      Object.assign(submission, saveSubmissionDto);

      return this.submissionsRepository.save(submission);
    }

    submission = this.submissionsRepository.create({
      attemptId,
      ...saveSubmissionDto,
    });

    return this.submissionsRepository.save(submission);
  }

  async findByAttemptId(attemptId: string, userId: string) {
    await this.attemptsService.findOne(attemptId, userId);

    const submission = await this.submissionsRepository.findOneBy({
      attemptId,
    });

    return submission ?? null;
  }
}
