import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "Our mission: help Pakistan youth with jobs and career tools."
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold">About</h1>
      <p className="mt-2 text-[rgb(var(--muted))]">
        CareerLift Pakistan is a free-first career platform built for Pakistan.
      </p>

      <div className="mt-6 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[rgb(var(--muted))]">
            Help Pakistan youth find jobs faster and present themselves professionally
            using simple, accessible tools.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Free-first approach</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[rgb(var(--muted))]">
            This MVP is intentionally designed to work without paid services or API keys.
            Cover letters and interview guidance are template-based with a “copy prompt”
            option for free AI websites.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

