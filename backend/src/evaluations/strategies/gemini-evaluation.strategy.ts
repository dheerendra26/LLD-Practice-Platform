import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { Problem } from '../../problems/entities/problem.entity.js';
import { Submission } from '../../submissions/entities/submission.entity.js';
import { EvaluationFeedbackDto } from '../dto/evaluation-feedback.dto.js';
import { EvaluationStrategy } from './evaluation-strategy.interface.js';

@Injectable()
export class GeminiEvaluationStrategy
  implements EvaluationStrategy
{
  private readonly ai: GoogleGenAI;

  private readonly models: string[];

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get<string>(
        'GEMINI_API_KEY',
      ),
    });

    this.models = [
      this.configService.get<string>(
        'GEMINI_MODEL_PRIMARY',
      ) || 'gemini-3.5-flash',

      this.configService.get<string>(
        'GEMINI_MODEL_FALLBACK',
      ) || 'gemini-3.6-flash',

      this.configService.get<string>(
        'GEMINI_MODEL_FINAL',
      ) || 'gemini-3.5-flash-lite',
    ];
  }

  async evaluate(
    problem: Problem,
    submission: Submission,
  ): Promise<EvaluationFeedbackDto> {
    const prompt = this.buildPrompt(
      problem,
      submission,
    );

    let lastError: unknown;

    for (const model of this.models) {
      try {
        console.log(
          `Trying Gemini model: ${model}`,
        );

        const result = await this.evaluateWithRetry(
          model,
          prompt,
        );

        console.log(
          `Gemini evaluation successful with: ${model}`,
        );

        return result;
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini model failed: ${model}`,
          error instanceof Error
            ? error.message
            : error,
        );
      }
    }

    throw new ServiceUnavailableException({
      message:
        'All Gemini models are temporarily unavailable',
      lastError:
        lastError instanceof Error
          ? lastError.message
          : 'Unknown error',
    });
  }

  private async evaluateWithRetry(
    model: string,
    prompt: string,
  ): Promise<EvaluationFeedbackDto> {
    const maxRetries = 2;

    for (
      let attempt = 0;
      attempt <= maxRetries;
      attempt++
    ) {
      try {
        const response =
          await this.ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

        if (!response.text) {
          throw new Error(
            'Gemini returned an empty response',
          );
        }

        return JSON.parse(
          response.text,
        ) as EvaluationFeedbackDto;
      } catch (error) {
        const isLastAttempt =
          attempt === maxRetries;

        if (isLastAttempt) {
          throw error;
        }

        if (!this.shouldRetry(error)) {
          throw error;
        }

        const delay =
          1000 * Math.pow(2, attempt);

        console.log(
          `Retrying ${model} in ${delay}ms...`,
        );

        await this.sleep(delay);
      }
    }

    throw new Error(
      'Gemini evaluation failed unexpectedly',
    );
  }

  private shouldRetry(error: unknown): boolean {
    if (
      typeof error !== 'object' ||
      error === null
    ) {
      return false;
    }

    const possibleError =
      error as {
        status?: number;
        message?: string;
      };

    return (
      possibleError.status === 429 ||
      possibleError.status === 500 ||
      possibleError.status === 502 ||
      possibleError.status === 503 ||
      possibleError.status === 504
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(resolve, ms),
    );
  }

  private buildPrompt(
    problem: Problem,
    submission: Submission,
  ): string {
    return `
You are an expert Low-Level Design interviewer.

Evaluate the learner's LLD solution.

IMPORTANT:
- Multiple designs can be valid.
- Do not compare against one exact reference solution.
- Evaluate the quality of reasoning and design decisions.
- Give constructive and explainable feedback.
- Base feedback only on evidence from the learner's submission.
- Do not invent classes or design decisions that the learner did not mention.
- Do not be unnecessarily harsh.

PROBLEM:

Title: ${problem.title}

Description:
${problem.description}

Requirements:
${problem.requirements
  .map((item) => `- ${item}`)
  .join('\n')}

Constraints:
${
  problem.constraints
    ?.map((item) => `- ${item}`)
    .join('\n') || 'None'
}

LEARNER SUBMISSION:

Assumptions:
${submission.assumptions || 'Not provided'}

Core Classes:
${submission.coreClasses || 'Not provided'}

Responsibilities:
${submission.responsibilities || 'Not provided'}

Relationships:
${submission.relationships || 'Not provided'}

Interfaces / Abstractions:
${submission.abstractions || 'Not provided'}

Design Decisions:
${submission.designDecisions || 'Not provided'}

Extensibility:
${submission.extensibility || 'Not provided'}

Evaluate using exactly these criteria:

1. Requirement Understanding
2. Class Responsibilities
3. Coupling and Cohesion
4. Encapsulation and Abstraction
5. Extensibility
6. Edge Cases and Testability
7. Quality of Explanation

Return a score from 0 to 10 for each criterion.

Return ONLY valid JSON in exactly this format:

{
  "overallScore": number,
  "summary": "string",
  "feedback": [
    {
      "criterion": "string",
      "score": number,
      "evidence": ["string"],
      "concerns": ["string"],
      "suggestion": "string",
      "confidence": number
    }
  ]
}
`;
  }
}