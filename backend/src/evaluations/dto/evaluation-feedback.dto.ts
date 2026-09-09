export interface EvaluationFeedbackDto {
  overallScore: number;
  summary: string;

  feedback: {
    criterion: string;
    score: number;
    evidence: string[];
    concerns: string[];
    suggestion: string;
    confidence?: number;
  }[];
}