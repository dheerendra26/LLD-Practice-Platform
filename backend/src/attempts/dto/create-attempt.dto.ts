import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAttemptDto {
  @IsUUID()
  @IsNotEmpty()
  problemId: string;
}