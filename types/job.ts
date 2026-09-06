export type JobType = "Full-time" | "Part-time" | "Remote";

export type Job = {
  id: string;
  slug: string;
  title: string;
  company: string;
  city: string;
  category:
    | "IT"
    | "Sales"
    | "Customer Support"
    | "Marketing"
    | "Finance"
    | "Operations";
  type: JobType;
  salaryPKR?: string;
  postedAtISO: string;
  tags: string[];
  description: string;
  requirements: string[];
  applyUrl?: string;
};

