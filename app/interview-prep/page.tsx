import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import { InterviewPrepClient, type InterviewPack } from "@/app/interview-prep/interview-client";

export const metadata: Metadata = {
  title: "Interview Preparation",
  description: "Common interview questions, sample answers, and a mock interview checklist."
};

export default async function InterviewPrepPage() {
  const packs = await apiFetch<InterviewPack[]>("/api/interview", { revalidate: 60 });
  return <InterviewPrepClient packs={packs} />;
}
