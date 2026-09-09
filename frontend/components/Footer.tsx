import Link from "next/link";
import { GitBranch } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-col items-center justify-center gap-3 px-4 py-5 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="text-center text-sm text-slate-500 sm:text-left">
          © {new Date().getFullYear()} LLD Practice Platform. Practice. Design.
          Improve.
        </p>

        <div className="flex items-center gap-5">
          <Link
            href="/problems"
            className="text-sm text-slate-500 transition hover:text-slate-900"
          >
            Problems
          </Link>

          <Link
            href="/attempts"
            className="text-sm text-slate-500 transition hover:text-slate-900"
          >
            Attempts
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-slate-500 transition hover:text-slate-900"
          >
            <GitBranch className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}