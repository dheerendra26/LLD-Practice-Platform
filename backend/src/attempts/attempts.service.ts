import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProblemsService } from '../problems/problems.service.js';
import { CreateAttemptDto } from './dto/create-attempt.dto.js';
import { Attempt, AttemptStatus } from './entities/attempt.entity.js';

@Injectable()
export class AttemptsService {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptsRepository: Repository<Attempt>,

    private readonly problemsService: ProblemsService,
  ) {}

  async create(createAttemptDto: CreateAttemptDto, userId: string) {
    const problem = await this.problemsService.findOne(
      createAttemptDto.problemId,
    );

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    const attempt = this.attemptsRepository.create({
      problem,
      problemId: problem.id,
      userId,
      status: AttemptStatus.DRAFT,
    });

    return this.attemptsRepository.save(attempt);
  }

  async findAll(userId: string) {
    return this.attemptsRepository.find({
      where: {
        userId,
      },
      relations: {
        evaluation: true,
      },
      order: {
        startedAt: 'DESC',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const attempt = await this.attemptsRepository.findOne({
      where: {
        id,
        userId,
      },
      relations: {
        submission: true,
        evaluation: true,
      },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    return attempt;
  }

  async save(attempt: Attempt) {
    return this.attemptsRepository.save(attempt);
  }

  async remove(id: string, userId: string) {
    const attempt = await this.findOne(id, userId);

    await this.attemptsRepository.remove(attempt);

    return {
      message: 'Attempt deleted successfully',
    };
  }
}
