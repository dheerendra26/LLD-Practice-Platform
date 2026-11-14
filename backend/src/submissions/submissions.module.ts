import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module.js';
import { AttemptsModule } from '../attempts/attempts.module.js';
import { Submission } from './entities/submission.entity.js';
import { SubmissionsController } from './submissions.controller.js';
import { SubmissionsService } from './submissions.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Submission]), AttemptsModule, AuthModule],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, JwtAuthGuard],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
