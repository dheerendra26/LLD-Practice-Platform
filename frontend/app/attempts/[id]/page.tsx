"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Loader2,
  Send,
  Save,
} from "lucide-react";

import api from "@/lib/api";
import { Attempt, Submission } from "@/types";

const initialSubmission: Submission = {
  assumptions: "",
  coreClasses: "",
  responsibilities: "",
  relationships: "",
  abstractions: "",
  designDecisions: "",
  extensibility: "",
};

export default function AttemptWorkspacePage() {
  const params = useParams();
  const router = useRouter();

  const attemptId = params.id as string;

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [submission, setSubmission] = useState<Submission>(initialSubmission);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    async function fetchAttempt() {
      try {
        setLoading(true);
        setError("");

        const attemptResponse = await api.get<Attempt>(
          `/attempts/${attemptId}`,
        );

        setAttempt(attemptResponse.data);

        const submissionResponse = await api.get<Submission | null>(
          `/attempts/${attemptId}/submission`,
        );

        if (submissionResponse.data) {
          setSubmission({
            assumptions: submissionResponse.data.assumptions || "",
            coreClasses: submissionResponse.data.coreClasses || "",
            responsibilities: submissionResponse.data.responsibilities || "",
            relationships: submissionResponse.data.relationships || "",
            abstractions: submissionResponse.data.abstractions || "",
            designDecisions: submissionResponse.data.designDecisions || "",
            extensibility: submissionResponse.data.extensibility || "",
          });

          setLastSavedAt(new Date());
        }

        setAutoSaveEnabled(true);
      } catch (error) {
        console.error(error);
        setError("Failed to load attempt.");
      } finally {
        setLoading(false);
      }
    }

    if (attemptId) {
      fetchAttempt();
    }
  }, [attemptId]);

  const saveSubmissionToServer = async (
    submissionData: Submission,
    showMessage = false,
  ) => {
    try {
      setSaving(true);
      setError("");

      await api.put<Submission>(
        `/attempts/${attemptId}/submission`,
        submissionData,
      );

      const savedTime = new Date();

      setLastSavedAt(savedTime);

      if (showMessage) {
        setSuccessMessage("Draft saved successfully");

        setTimeout(() => {
          setSuccessMessage("");
        }, 2500);
      }

      return true;
    } catch (error) {
      console.error(error);
      setError("Failed to save submission.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!autoSaveEnabled || loading || evaluating) {
      return;
    }

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveSubmissionToServer(submission);
    }, 1500);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [submission, autoSaveEnabled, loading, evaluating]);

  const updateField = (field: keyof Submission, value: string) => {
    setSubmission((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSuccessMessage("");
  };

  const handleManualSave = async () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    await saveSubmissionToServer(submission, true);
  };

  const handleEvaluate = async () => {
    try {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      setEvaluating(true);
      setError("");
      setSuccessMessage("");

      const saved = await saveSubmissionToServer(submission);

      if (!saved) {
        setEvaluating(false);
        return;
      }

      await api.post(`/attempts/${attemptId}/evaluation`);

      router.push(`/attempts/${attemptId}/evaluation`);
    } catch (error) {
      console.error(error);

      setError("Failed to evaluate your solution. Please try again.");
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </main>
    );
  }

  if (!attempt) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <CircleAlert className="mx-auto mb-4 h-10 w-10 text-red-500" />

          <h1 className="text-xl font-semibold text-slate-900">
            Attempt not found
          </h1>

          <Link href="/problems" className="mt-4 inline-block text-blue-600">
            Back to Problems
          </Link>
        </div>
      </main>
    );
  }

  const fields: {
    key: keyof Submission;
    label: string;
    placeholder: string;
    description: string;
  }[] = [
    {
      key: "assumptions",
      label: "Assumptions",
      placeholder: "Write the assumptions you are making for this system...",
      description:
        "Mention assumptions that help define the scope of your design.",
    },
    {
      key: "coreClasses",
      label: "Core Classes",
      placeholder: "Example: ParkingLot, ParkingFloor, ParkingSpot, Vehicle...",
      description: "List the main classes or entities in your design.",
    },
    {
      key: "responsibilities",
      label: "Class Responsibilities",
      placeholder: "Explain what responsibility each important class has...",
      description: "Describe what each class is responsible for.",
    },
    {
      key: "relationships",
      label: "Relationships",
      placeholder: "Explain how the classes are connected...",
      description: "Describe inheritance, composition, and associations.",
    },
    {
      key: "abstractions",
      label: "Interfaces & Abstractions",
      placeholder: "Describe interfaces, abstract classes, or abstractions...",
      description: "Explain how you separate common behavior.",
    },
    {
      key: "designDecisions",
      label: "Design Decisions",
      placeholder: "Explain important design patterns and decisions...",
      description: "Mention patterns such as Strategy, Factory, Observer, etc.",
    },
    {
      key: "extensibility",
      label: "Extensibility",
      placeholder: "Explain how the design can support future changes...",
      description: "Describe how new features can be added.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/problems/${attempt.problemId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Problem
          </Link>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-500">
              LLD ATTEMPT
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {attempt.problem.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Write your Low-Level Design solution below. Your work is
              automatically saved while you type.
            </p>

            <div className="mt-3 text-sm">
              {saving ? (
                <span className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving changes...
                </span>
              ) : lastSavedAt ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Auto-saved
                </span>
              ) : (
                <span className="text-slate-500">
                  Start writing your solution
                </span>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              onClick={handleManualSave}
              disabled={saving || evaluating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {saving ? "Saving..." : "Save Draft"}
            </button>

            <button
              onClick={handleEvaluate}
              disabled={saving || evaluating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {evaluating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              {evaluating ? "Evaluating..." : "Evaluate Solution"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />

            <p className="text-sm">{successMessage}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            {fields.map((field) => (
              <section
                key={field.key}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {field.label}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {field.description}
                  </p>
                </div>

                <textarea
                  value={submission[field.key] || ""}
                  onChange={(event) =>
                    updateField(field.key, event.target.value)
                  }
                  placeholder={field.placeholder}
                  rows={6}
                  disabled={evaluating}
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-600 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </section>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Problem Requirements
            </h2>

            <div className="mt-5 space-y-4">
              {attempt.problem.requirements.map((requirement) => (
                <div key={requirement} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                  <span className="text-sm leading-6 text-slate-600">
                    {requirement}
                  </span>
                </div>
              ))}
            </div>

            {attempt.problem.constraints &&
              attempt.problem.constraints.length > 0 && (
                <>
                  <div className="my-6 border-t border-slate-200" />

                  <h3 className="font-semibold text-slate-900">Constraints</h3>

                  <div className="mt-4 space-y-3">
                    {attempt.problem.constraints.map((constraint) => (
                      <div key={constraint} className="flex items-start gap-3">
                        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />

                        <span className="text-sm leading-6 text-slate-600">
                          {constraint}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
          </aside>
        </div>
      </div>
    </main>
  );
}
