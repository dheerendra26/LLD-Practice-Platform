import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProblemDifficulty } from '../entities/problem.entity.js';

export class CreateProblemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ProblemDifficulty)
  difficulty: ProblemDifficulty;

  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  constraints?: string[];
}