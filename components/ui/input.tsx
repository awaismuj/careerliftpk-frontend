"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border bg-[rgb(var(--card))] px-3 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[rgb(var(--primary))]",
        className
      )}
      {...props}
    />
  );
}

