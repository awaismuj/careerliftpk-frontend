"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = ""; // optional: e.g. "923001234567"

export function WhatsAppFloat() {
  if (!WHATSAPP_NUMBER) return null;
  const href = `https://wa.me/${WHATSAPP_NUMBER}`;
  return (
    <Link
      href={href}
      target="_blank"
      className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--accent))] text-white shadow-lg hover:bg-[rgb(var(--accent))]/90"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
    </Link>
  );
}

