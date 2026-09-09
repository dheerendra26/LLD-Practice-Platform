"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  PlayCircle,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";

import api from "@/lib/api";
import { Attempt } from "@/types";

export default function AttemptsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<Attempt[]>("/attempts");

        setAttempts(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load attempts.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  const getStatusStyle = (status: Attempt["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "EVALUATING":
        return "bg-blue-100 text-blue-700";

      case "SUBMITTED":
        return "bg-purple-100 text-purple-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement>,
    attemptId: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this attempt?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(attemptId);

      await api.delete(`/attempts/${attemptId}`);

      setAttempts((currentAttempts) =>
        currentAttempts.filter((attempt) => attempt.id !== attemptId),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete attempt.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRetryEvaluation = async (
    event: React.MouseEvent<HTMLButtonElement>,
    attemptId: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      setRetryingId(attemptId);

      await api.post(`/attempts/${attemptId}/evaluation`);

      setAttempts((currentAttempts) =>
        currentAttempts.map((attempt) =>
          attempt.id === attemptId
            ? { ...attempt, status: "EVALUATING" }
            : attempt,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to restart evaluation.");
    } finally {
      setRetryingId(null);
    }
  };

  const getDifficultyStyle = (difficulty?: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-50 text-green-700";

      case "MEDIUM":
        return "bg-yellow-50 text-yellow-700";

      case "HARD":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getAttemptLink = (attempt: Attempt) => {
    if (attempt.status === "COMPLETED" || attempt.status === "FAILED") {
      return `/attempts/${attempt.id}/evaluation`;
    }

    return `/attempts/${attempt.id}`;
  };

  const getActionText = (attempt: Attempt) => {
    switch (attempt.status) {
      case "COMPLETED":
        return "View Evaluation";

      case "FAILED":
        return "Retry Evaluation";

      case "EVALUATING":
      case "SUBMITTED":
        return "View Status";

      default:
        return "Continue Attempt";
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <p className="mb-2 text-sm font-medium text-slate-500">
            YOUR PROGRESS
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            My Attempts
          </h1>

          <p className="mt-3 text-slate-600">
            View your previous LLD attempts and AI evaluations.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!error && attempts.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <PlayCircle className="mx-auto mb-4 h-10 w-10 text-slate-400" />

            <h2 className="text-xl font-semibold text-slate-900">
              No attempts yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Start practicing a problem to see your attempts here.
            </p>

            <Link
              href="/problems"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse Problems
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {attempts.length > 0 && (
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <Link
                key={attempt.id}
                href={getAttemptLink(attempt)}
                className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          attempt.status,
                        )}`}
                      >
                        {attempt.status}
                      </span>

                      {attempt.problem?.difficulty && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyStyle(
                            attempt.problem.difficulty,
                          )}`}
                        >
                          {attempt.problem.difficulty}
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" />

                        {new Date(attempt.startedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="truncate text-xl font-semibold text-slate-900">
                      {attempt.problem?.title || "LLD Problem"}
                    </h2>

                    {attempt.status === "COMPLETED" && (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Evaluation completed
                        </div>

                        {attempt.evaluation?.overallScore !== undefined &&
                          attempt.evaluation?.overallScore !== null && (
                            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white">
                              <Sparkles className="h-3.5 w-3.5" />
                              Score:{" "}
                              {Number(attempt.evaluation.overallScore).toFixed(
                                1,
                              )}
                              /10
                            </div>
                          )}
                      </div>
                    )}

                    {attempt.status === "FAILED" && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                        <RotateCcw className="h-4 w-4" />
                        Evaluation failed — retry available
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition group-hover:text-slate-900">
                      {attempt.status === "FAILED" ? (
                        <button
                          type="button"
                          onClick={(event) =>
                            handleRetryEvaluation(event, attempt.id)
                          }
                          disabled={retryingId === attempt.id}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {retryingId === attempt.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Retrying...
                            </>
                          ) : (
                            <>
                              <RotateCcw className="h-4 w-4" />
                              Retry
                            </>
                          )}
                        </button>
                      ) : (
                        <>
                          {getActionText(attempt)}

                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(event) => handleDelete(event, attempt.id)}
                      disabled={deletingId === attempt.id}
                      aria-label="Delete attempt"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === attempt.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
