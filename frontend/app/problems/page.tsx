"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Search,
  SearchX,
  ListChecks,
} from "lucide-react";

import api from "@/lib/api";
import { Problem } from "@/types";

type DifficultyFilter = "ALL" | "EASY" | "MEDIUM" | "HARD";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyFilter>("ALL");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get<Problem[]>("/problems");

        setProblems(response.data);
      } catch (error) {
        console.error("Failed to load problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    const difficultyOrder: Record<string, number> = {
      EASY: 1,
      MEDIUM: 2,
      HARD: 3,
    };

    return [...problems]
      .filter((problem) => {
        const matchesDifficulty =
          selectedDifficulty === "ALL" ||
          problem.difficulty === selectedDifficulty;

        const matchesSearch =
          !searchValue ||
          problem.title.toLowerCase().includes(searchValue) ||
          problem.description.toLowerCase().includes(searchValue);

        return matchesDifficulty && matchesSearch;
      })
      .sort(
        (a, b) =>
          difficultyOrder[a.difficulty] -
          difficultyOrder[b.difficulty]
      );
  }, [problems, search, selectedDifficulty]);

  const filters: {
    label: string;
    value: DifficultyFilter;
  }[] = [
      { label: "All", value: "ALL" },
      { label: "Easy", value: "EASY" },
      { label: "Medium", value: "MEDIUM" },
      { label: "Hard", value: "HARD" },
    ];

  const difficultyStyles: Record<string, string> = {
    EASY: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HARD: "bg-red-100 text-red-700",
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
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold tracking-wide text-slate-500">
              PRACTICE LIBRARY
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              LLD Problems
            </h1>

            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Search and practice real-world Low-Level Design problems.
            </p>
          </div>

          <div className="rounded-xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <span className="font-semibold text-slate-900">
              {filteredProblems.length}
            </span>{" "}
            problems available
          </div>
        </div>

        <div className="relative mt-8">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search problems..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedDifficulty(filter.value)}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${selectedDifficulty === filter.value
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {filteredProblems.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <SearchX className="mx-auto h-10 w-10 text-slate-400" />

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No problems found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or difficulty filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSelectedDifficulty("ALL");
              }}
              className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-xl bg-slate-100 p-3">
                    <BookOpen className="h-6 w-6 text-slate-700" />
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyStyles[problem.difficulty]
                      }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                <h2 className="mt-6 text-xl font-bold text-slate-900">
                  {problem.title}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {problem.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <ListChecks className="h-4 w-4" />

                  <span>
                    {problem.requirements.length}{" "}
                    {problem.requirements.length === 1
                      ? "requirement"
                      : "requirements"}
                  </span>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <Link
                    href={`/problems/${problem.id}`}
                    className="flex items-center justify-between text-sm font-semibold text-slate-900"
                  >
                    View Problem
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}