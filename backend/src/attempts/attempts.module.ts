import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ProblemsModule } from '../problems/problems.module.js';
import { AttemptsController } from './attempts.controller.js';
import { AttemptsService } from './attempts.service.js';
import { Attempt } from './entities/attempt.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Attempt]), ProblemsModule, AuthModule],
  controllers: [AttemptsController],
  providers: [AttemptsService, JwtAuthGuard],
  exports: [AttemptsService],
})
export class AttemptsModule {}
