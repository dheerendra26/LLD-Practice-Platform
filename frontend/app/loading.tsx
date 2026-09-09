import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-9 w-9 animate-spin text-slate-700" />

        <p className="text-sm text-slate-500">
          Loading...
        </p>
      </div>
    </main>
  );
}