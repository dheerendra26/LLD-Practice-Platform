"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Loader2,
  PlayCircle,
  Sparkles,
  Trophy,
} from "lucide-react";

import api from "@/lib/api";
import { Attempt, Problem } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const problemsResponse = await api.get<Problem[]>("/problems");

        if (!cancelled) {
          setProblems(problemsResponse.data);
        }

        if (user) {
          const attemptsResponse = await api.get<Attempt[]>("/attempts");

          if (!cancelled) {
            setAttempts(attemptsResponse.data);
          }
        } else {
          setAttempts([]);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const completedAttempts = useMemo(
    () => attempts.filter((attempt) => attempt.status === "COMPLETED"),
    [attempts],
  );

  const scores = useMemo(
    () =>
      completedAttempts
        .map((attempt) => Number(attempt.evaluation?.overallScore))
        .filter((score) => !Number.isNaN(score)),
    [completedAttempts],
  );

  const averageScore =
    scores.length > 0
      ? scores.reduce((total, score) => total + score, 0) / scores.length
      : 0;

  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

  const recentAttempts = attempts.slice(0, 5);

  const stats = [
    {
      label: "Available Problems",
      value: problems.length,
      icon: BookOpen,
    },
    {
      label: "Total Attempts",
      value: attempts.length,
      icon: ClipboardList,
    },
    {
      label: "Completed",
      value: completedAttempts.length,
      icon: CheckCircle2,
    },
    {
      label: "Average Score",
      value: scores.length > 0 ? averageScore.toFixed(1) : "—",
      icon: Award,
    },
  ];

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

  const getAttemptLink = (attempt: Attempt) => {
    if (
      attempt.status === "COMPLETED" ||
      attempt.status === "FAILED" ||
      attempt.status === "EVALUATING"
    ) {
      return `/attempts/${attempt.id}/evaluation`;
    }

    return `/attempts/${attempt.id}`;
  };

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Hero */}
        <section className="rounded-3xl bg-slate-900 px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="mb-3 text-sm font-semibold tracking-wide text-slate-300">
            LOW-LEVEL DESIGN PRACTICE
          </p>

          <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            Practice. Design. Improve.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Solve real-world Low-Level Design problems and receive AI-powered
            feedback on your architecture, design decisions, abstractions, and
            extensibility.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/problems"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <PlayCircle className="h-5 w-5" />
              Start Practicing
            </Link>

            <Link
              href="/attempts"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View My Attempts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-100 p-3">
                    <Icon className="h-6 w-6 text-slate-700" />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Best Score */}
        {scores.length > 0 && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-slate-900 p-4">
                  <Trophy className="h-7 w-7 text-white" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Your Best Score
                  </p>

                  <h2 className="mt-1 text-3xl font-bold text-slate-900">
                    {bestScore.toFixed(1)}
                    <span className="text-lg text-slate-400"> / 10</span>
                  </h2>
                </div>
              </div>

              <Link
                href="/attempts"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
              >
                View All Attempts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Recent Attempts */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Attempts
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Continue your work or review your latest evaluations.
              </p>
            </div>

            {attempts.length > 0 && (
              <Link
                href="/attempts"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900"
              >
                View All
              </Link>
            )}
          </div>

          {recentAttempts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <ClipboardList className="mx-auto h-9 w-9 text-slate-400" />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No attempts yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Start solving a problem to track your progress here.
              </p>

              <Link
                href="/problems"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Browse Problems
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <Link
                  key={attempt.id}
                  href={getAttemptLink(attempt)}
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          attempt.status,
                        )}`}
                      >
                        {attempt.status}
                      </span>

                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" />
                        {new Date(attempt.startedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="mt-3 truncate text-lg font-semibold text-slate-900">
                      {attempt.problem?.title || "LLD Problem"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {attempt.status === "COMPLETED" &&
                      attempt.evaluation?.overallScore !== undefined && (
                        <div className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
                          <Sparkles className="h-4 w-4" />
                          {Number(attempt.evaluation.overallScore).toFixed(1)}
                          /10
                        </div>
                      )}

                    <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>

            <p className="mt-1 text-sm text-slate-500">
              Continue practicing and improve your LLD skills.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href="/problems"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <BookOpen className="h-8 w-8 text-slate-700" />

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Browse Problems
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose an LLD problem and start designing your solution.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-900">
                Explore Problems
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/attempts"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <ClipboardList className="h-8 w-8 text-slate-700" />

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                My Attempts
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Review your previous solutions and AI evaluation results.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-900">
                View Attempts
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
