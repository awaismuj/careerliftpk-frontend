import type { Metadata } from "next";
import { getAllJobs } from "@/lib/jobs";
import { JobsClient } from "@/app/jobs/jobs-client";

export const metadata: Metadata = {
  title: "Jobs in Pakistan",
  description: "Browse jobs in Pakistan by city, category, and type."
};

export default async function JobsPage() {
  const jobs = await getAllJobs();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Jobs</h1>
        <p className="text-[rgb(var(--muted))]">
          Search and filter jobs. Save jobs locally on your device.
        </p>
      </div>
      <div className="mt-6">
        <JobsClient jobs={jobs} />
      </div>
    </div>
  );
}

