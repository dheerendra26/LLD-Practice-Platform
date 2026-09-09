import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProblemDto } from './dto/create-problem.dto.js';
import { Problem } from './entities/problem.entity.js';
import { PROBLEMS_SEED } from './problems.seed.js';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: Repository<Problem>,
  ) {}

  async create(createProblemDto: CreateProblemDto) {
    const problem = this.problemsRepository.create(createProblemDto);

    return this.problemsRepository.save(problem);
  }

  async findAll() {
    return this.problemsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    return this.problemsRepository.findOneBy({ id });
  }

  async seedProblems() {
    const count = await this.problemsRepository.count();

    if (count > 0) {
      return;
    }

    const problems = this.problemsRepository.create(PROBLEMS_SEED);

    await this.problemsRepository.save(problems);
  }
}