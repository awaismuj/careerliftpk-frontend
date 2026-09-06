"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { ButtonLink } from "@/components/ui/button";

const links = [
  { href: "/jobs", label: "Jobs" },
  { href: "/cv-builder", label: "CV Builder" },
  { href: "/cover-letter", label: "Cover Letter" },
  { href: "/interview-prep", label: "Interview Prep" },
  { href: "/blog", label: "Blog" }
];

export function SiteNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-[rgb(var(--bg))]/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[rgb(var(--primary))] text-white">
              CL
            </span>
            <span className="hidden sm:inline">CareerLift Pakistan</span>
            <span className="sm:hidden">CareerLift</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active =
                pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800",
                    active && "bg-slate-100 dark:bg-slate-800"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ButtonLink href="/cv-builder" variant="primary" size="sm">
              Create CV
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}

