"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Loader2,
  Play,
} from "lucide-react";

import api from "@/lib/api";
import { Problem } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function ProblemDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const problemId = params.id as string;

  const { user, isLoading: authLoading } = useAuth();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProblem() {
      try {
        setLoading(true);

        const response = await api.get<Problem>(
          `/problems/${problemId}`
        );

        setProblem(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load problem");
      } finally {
        setLoading(false);
      }
    }

    if (problemId) {
      fetchProblem();
    }
  }, [problemId]);

  const handleStartAttempt = async () => {
    if (!problem) return;

    if (authLoading) return;

    if (!user) {
      const redirect = encodeURIComponent(`/problems/${problemId}`);

      router.push(`/login?redirect=${redirect}`);
      return;
    }

    try {
      setStarting(true);
      setError("");

      const response = await api.post("/attempts", {
        problemId: problem.id,
      });

      router.push(`/attempts/${response.data.id}`);
    } catch (error) {
      console.error(error);
      setError("Failed to start attempt. Please try again.");
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </main>
    );
  }

  if (!problem) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <CircleAlert className="mx-auto mb-4 h-10 w-10" />

          <h1 className="text-xl font-semibold">
            Problem not found
          </h1>

          <Link
            href="/problems"
            className="mt-4 inline-block text-blue-600"
          >
            Back to problems
          </Link>
        </div>
      </main>
    );
  }

  const difficultyStyles = {
    EASY: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HARD: "bg-red-100 text-red-700",
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/problems"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Problems
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyStyles[problem.difficulty]
                    }`}
                >
                  {problem.difficulty}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {problem.title}
              </h1>
            </div>

            <button
              onClick={handleStartAttempt}
              disabled={starting || authLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {starting || authLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Play className="h-5 w-5" />
              )}

              {starting
                ? "Starting..."
                : authLoading
                  ? "Checking..."
                  : user
                    ? "Start Attempt"
                    : "Login to Start"}
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">
              Problem Description
            </h2>

            <p className="leading-7 text-slate-600">
              {problem.description}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">
              Requirements
            </h2>

            <div className="space-y-3">
              {problem.requirements.map((requirement) => (
                <div
                  key={requirement}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                  <span className="text-slate-600">
                    {requirement}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {problem.constraints &&
            problem.constraints.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold">
                  Constraints
                </h2>

                <div className="space-y-3">
                  {problem.constraints.map((constraint) => (
                    <div
                      key={constraint}
                      className="flex items-start gap-3"
                    >
                      <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />

                      <span className="text-slate-600">
                        {constraint}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
        </div>
      </div>
    </main>
  );
}