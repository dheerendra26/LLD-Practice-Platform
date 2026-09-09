export type ProblemDifficulty =
  | 'EASY'
  | 'MEDIUM'
  | 'HARD';

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  requirements: string[];
  constraints?: string[];
  createdAt: string;
  updatedAt: string;
}

export type AttemptStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'EVALUATING'
  | 'COMPLETED'
  | 'FAILED';

export interface FeedbackItem {
  id: string;
  criterion: string;
  score: number | string;
  evidence: string[];
  concerns: string[];
  suggestion: string;
  confidence?: number | string;
}

export interface Evaluation {
  id: string;
  attemptId: string;
  status: 'PENDING' | 'EVALUATING' | 'COMPLETED' | 'FAILED';
  overallScore?: number | string;
  summary?: string;
  errorMessage?: string;
  feedback: FeedbackItem[];
}

export interface Attempt {
  id: string;
  problemId: string;
  status: AttemptStatus;
  startedAt: string;
  submittedAt?: string;
  updatedAt: string;

  problem: Problem;

  evaluation?: Evaluation;
}

export interface Submission {
  id?: string;
  attemptId?: string;
  assumptions?: string;
  coreClasses?: string;
  responsibilities?: string;
  relationships?: string;
  abstractions?: string;
  designDecisions?: string;
  extensibility?: string;
}