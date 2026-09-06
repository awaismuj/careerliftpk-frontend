import type { Metadata } from "next";
import { getAllJobs } from "@/lib/jobs";
import { JobsClient } from "@/app/jobs/jobs-client";
import type { Job } from "@/types/job";

export const metadata: Metadata = {
  title: "Jobs in Pakistan",
  description: "Browse jobs in Pakistan by city, category, and type."
};

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  let jobs: Job[] = [];

  try {
    const result = await getAllJobs();

    if (Array.isArray(result)) {
      jobs = result;
    } else {
      console.error("Invalid jobs response: expected an array", result);
      jobs = [];
    }
  } catch (error) {
    console.error("Failed to load jobs:", error);
    jobs = [];
  }

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
