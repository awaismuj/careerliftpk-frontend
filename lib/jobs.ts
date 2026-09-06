import type { Job } from "@/types/job";
import { ApiError, apiFetch } from "@/lib/api";

export async function getAllJobs(): Promise<Job[]> {
  return apiFetch<Job[]>("/api/jobs", { revalidate: 60 });
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  try {
    return await apiFetch<Job>(`/api/jobs/${encodeURIComponent(slug)}`, { revalidate: 60 });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return undefined;
    throw err;
  }
}

export const jobCities = ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Multan", "Remote"] as const;
export const jobTypes = ["Full-time", "Part-time", "Remote"] as const;
export const jobCategories = ["IT", "Sales", "Customer Support", "Marketing", "Finance", "Operations"] as const;
