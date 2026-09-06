import * as React from "react";
import { cn } from "@/lib/cn";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs text-[rgb(var(--fg))] bg-[rgb(var(--card))]",
        className
      )}
      {...props}
    />
  );
}

