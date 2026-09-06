import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import {
  InterviewPrepClient,
  type InterviewPack
} from "@/app/interview-prep/interview-client";

export const metadata: Metadata = {
  title: "Interview Preparation",
  description:
    "Common interview questions, sample answers, and a mock interview checklist."
};

export const dynamic = "force-dynamic";

export default async function InterviewPrepPage() {
  let packs: InterviewPack[] = [];

  try {
    packs = await apiFetch<InterviewPack[]>("/api/interview", {
      revalidate: 60
    });
  } catch (error) {
    console.error("Failed to load interview preparation data:", error);
    packs = [];
  }

  return <InterviewPrepClient packs={packs} />;
}
