import type { Metadata } from "next";
import { OnboardingFlow } from "@/landing/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Business Profile — Thalamus AI",
  description:
    "Give Thalamus the first layer of context about your business, goals, and available systems.",
};

export default function OnboardingProfilePage() {
  return <OnboardingFlow />;
}
