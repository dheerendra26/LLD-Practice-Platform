"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isLoading, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  const links = [
    {
      name: "Home",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Problems",
      href: "/problems",
      icon: BookOpen,
    },
    ...(user
      ? [
        {
          name: "My Attempts",
          href: "/attempts",
          icon: ClipboardList,
        },
      ]
      : []),
  ];

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.push("/problems");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
            L
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900 sm:text-base">
              Archie
            </p>

            <p className="hidden text-xs text-slate-500 sm:block">
              AI-powered learning
            </p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <nav className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => {
              const Icon = link.icon;

              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition sm:px-4 ${isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  <span className="hidden sm:inline">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {!isLoading &&
            (user ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((previous) => !previous)}
                  aria-label="Open profile"
                  aria-haspopup="dialog"
                  aria-expanded={profileOpen}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <UserRound className="h-5 w-5" />

                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                </button>

                {profileOpen && (
                  <section
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby="profile-modal-title"
                    className="absolute right-0 top-full z-[60] mt-3 max-h-[calc(100dvh-6rem)] w-[min(20rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                      <h2
                        id="profile-modal-title"
                        className="text-base font-semibold text-slate-900"
                      >
                        My Account
                      </h2>

                      <button
                        type="button"
                        onClick={() => setProfileOpen(false)}
                        aria-label="Close profile"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="m-3 rounded-xl bg-slate-100 px-4 py-7 text-center sm:px-5">
                      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-white">
                        <UserRound className="h-10 w-10" />

                        <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-slate-100 bg-green-500" />
                      </div>

                      <h3 className="mt-4 break-words text-lg font-bold text-slate-900">
                        {user.name}
                      </h3>

                      <p className="mt-1 break-all text-sm text-slate-600">
                        {user.email}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 p-4">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  href="/login"
                  className="rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:px-3"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 sm:px-4"
                >
                  Sign Up
                </Link>
              </div>
            ))}
        </div>
      </div>
    </header>
  );
}