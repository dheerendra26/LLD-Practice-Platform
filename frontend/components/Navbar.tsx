"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ClipboardList, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

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
    {
      name: "My Attempts",
      href: "/attempts",
      icon: ClipboardList,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/problems" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
            L
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900 sm:text-base">
              LLD Practice
            </p>

            <p className="hidden text-xs text-slate-500 sm:block">
              AI-powered learning
            </p>
          </div>
        </Link>

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
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />

                <span className="hidden sm:inline">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
