"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import api from "@/lib/api";

type FeedbackItem = {
  id: string;
  criterion: string;
  score: string;
  evidence: string[];
  concerns: string[];
  suggestion: string;
  confidence: string;
};

type Evaluation = {
  id: string;
  attemptId: string;
  status: "PENDING" | "EVALUATING" | "COMPLETED" | "FAILED";
  overallScore?: string;
  summary?: string;
  errorMessage?: string;
  feedback: FeedbackItem[];
};

export default function EvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [attemptId, setAttemptId] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setAttemptId(resolvedParams.id);
    };

    getParams();
  }, [params]);

  const fetchEvaluation = useCallback(async () => {
    if (!attemptId) return;

    try {
      setLoading(true);
      setError("");

      const response = await api.get<Evaluation>(
        `/attempts/${attemptId}/evaluation`,
      );

      setEvaluation(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load evaluation.");
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    fetchEvaluation();
  }, [fetchEvaluation]);


  const handleRetryEvaluation = async () => {
    try {
      setRetrying(true);

      await api.post(`/attempts/${attemptId}/evaluation`);

      const response = await api.get<Evaluation>(
        `/attempts/${attemptId}/evaluation`,
      );

      setEvaluation(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setRetrying(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-9 w-9 animate-spin text-slate-700" />
          <p className="text-sm text-slate-500">Loading evaluation...</p>
        </div>
      </main>
    );
  }

  if (error && !evaluation) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-6 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm text-slate-600">{error}</p>

          <button
            onClick={fetchEvaluation}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!evaluation) {
    return null;
  }

  const score = Number(evaluation.overallScore ?? 0);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/attempts/${attemptId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Attempt
        </Link>

        {evaluation.status === "FAILED" && (
          <section className="mx-auto flex min-h-[calc(100vh-180px)] max-w-2xl items-center justify-center">
            <div className="w-full rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="h-7 w-7 text-red-600" />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-slate-900">
                Evaluation Failed
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                We could not complete the AI evaluation for this attempt.
              </p>

              {evaluation.errorMessage && (
                <div className="mt-5 rounded-xl bg-red-50 p-4 text-left">
                  <p className="text-sm text-red-700">
                    {evaluation.errorMessage}
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={handleRetryEvaluation}
                  disabled={retrying}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {retrying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Retry Evaluation
                    </>
                  )}
                </button>

                <Link
                  href={`/attempts/${attemptId}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to Attempt
                </Link>
              </div>
            </div>
          </section>
        )}

        {evaluation.status === "COMPLETED" && (
          <>
            <section className="rounded-3xl bg-slate-900 p-6 text-white sm:p-10">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                    <Sparkles className="h-4 w-4" />
                    AI EVALUATION COMPLETE
                  </div>

                  <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
                    Your Design Evaluation
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    {evaluation.summary}
                  </p>
                </div>

                <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border-8 border-slate-700 bg-slate-800">
                  <span className="text-4xl font-bold">{score.toFixed(1)}</span>

                  <span className="text-xs text-slate-400">OUT OF 10</span>
                </div>
              </div>
            </section>

            <section className="mt-8 space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Detailed Feedback
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review each area of your Low-Level Design solution.
                </p>
              </div>

              {evaluation.feedback.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {item.criterion}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Confidence: {item.confidence}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2">
                      <CheckCircle2 className="h-4 w-4 text-slate-700" />

                      <span className="text-sm font-bold text-slate-900">
                        {Number(item.score).toFixed(1)} / 10
                      </span>
                    </div>
                  </div>

                  {item.evidence.length > 0 && (
                    <div className="mt-5">
                      <h4 className="text-sm font-semibold text-slate-900">
                        What you did well
                      </h4>

                      <ul className="mt-2 space-y-2">
                        {item.evidence.map((evidence, index) => (
                          <li
                            key={index}
                            className="text-sm leading-6 text-slate-600"
                          >
                            • {evidence}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.concerns.length > 0 && (
                    <div className="mt-5">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Areas to improve
                      </h4>

                      <ul className="mt-2 space-y-2">
                        {item.concerns.map((concern, index) => (
                          <li
                            key={index}
                            className="text-sm leading-6 text-slate-600"
                          >
                            • {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-slate-900">
                      Recommendation
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.suggestion}
                    </p>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {(evaluation.status === "PENDING" ||
          evaluation.status === "EVALUATING") && (
            <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-slate-700" />

              <h1 className="mt-5 text-2xl font-bold text-slate-900">
                Evaluating your solution...
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The AI is analyzing your Low-Level Design solution.
              </p>
            </section>
          )}
      </div>
    </main>
  );
}
