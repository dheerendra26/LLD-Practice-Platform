"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function AttemptsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            const redirect = encodeURIComponent(
                pathname + window.location.search
            );

            router.replace(`/login?redirect=${redirect}`);
        }
    }, [isLoading, user, pathname, router]);

    if (isLoading || !user) {
        return (
            <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
            </main>
        );
    }

    return <>{children}</>;
}