import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity.js';
import { ProblemsController } from './problems.controller.js';
import { ProblemsService } from './problems.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Problem])],
  controllers: [ProblemsController],
  providers: [ProblemsService],
  exports: [ProblemsService],
})
export class ProblemsModule implements OnModuleInit {
  constructor(private readonly problemsService: ProblemsService) {}

  async onModuleInit() {
    await this.problemsService.seedProblems();
  }
}