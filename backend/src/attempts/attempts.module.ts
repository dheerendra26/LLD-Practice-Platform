import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemsModule } from '../problems/problems.module.js';
import { AttemptsController } from './attempts.controller.js';
import { AttemptsService } from './attempts.service.js';
import { Attempt } from './entities/attempt.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Attempt]), ProblemsModule],
  controllers: [AttemptsController],
  providers: [AttemptsService],
  exports: [AttemptsService],
})
export class AttemptsModule {}
