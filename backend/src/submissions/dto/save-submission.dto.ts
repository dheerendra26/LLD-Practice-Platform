import {
  IsOptional,
  IsString,
} from 'class-validator';

export class SaveSubmissionDto {
  @IsOptional()
  @IsString()
  assumptions?: string;

  @IsOptional()
  @IsString()
  coreClasses?: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsString()
  relationships?: string;

  @IsOptional()
  @IsString()
  abstractions?: string;

  @IsOptional()
  @IsString()
  designDecisions?: string;

  @IsOptional()
  @IsString()
  extensibility?: string;
}