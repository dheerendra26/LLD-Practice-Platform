import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />

        <p className="text-sm text-slate-500">
          Loading attempt...
        </p>
      </div>
    </main>
  );
}