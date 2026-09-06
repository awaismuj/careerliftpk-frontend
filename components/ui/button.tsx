"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary))]/90",
  secondary:
    "bg-[rgb(var(--card))] text-[rgb(var(--fg))] border hover:bg-[rgb(var(--card))]/70",
  ghost: "hover:bg-slate-100 dark:hover:bg-slate-800"
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base"
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}) {
  if (asChild) {
    // used only for Links
    return (
      <span className={cn(base, variants[variant], sizes[size], className)} />
    );
  }
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  size = "md"
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}

