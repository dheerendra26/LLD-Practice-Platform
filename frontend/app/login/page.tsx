"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, LockKeyhole } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

function getRedirectPath() {
    const redirect = new URLSearchParams(window.location.search).get(
        "redirect"
    );

    if (
        redirect &&
        redirect.startsWith("/") &&
        !redirect.startsWith("//")
    ) {
        return redirect;
    }

    return "/problems";
}

function getErrorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
            return message.join(", ");
        }

        if (typeof message === "string") {
            return message;
        }
    }

    return "Unable to login. Please try again.";
}

export default function LoginPage() {
    const router = useRouter();

    const { user, isLoading, login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoading && user) {
            router.replace(getRedirectPath());
        }
    }, [user, isLoading, router]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            await login(email.trim(), password);

            router.replace(getRedirectPath());
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading || user) {
        return (
            <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
            </main>
        );
    }

    return (
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <LockKeyhole className="h-6 w-6" />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-slate-900">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Login to continue your LLD practice.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Email address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}

                        {submitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-7 text-center text-sm text-slate-600">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-slate-900 hover:underline"
                    >
                        Create account
                    </Link>
                </p>
            </div>
        </main>
    );
}