import { SovereignDashboard } from "@/components/sovereign-dashboard";

export const metadata = {
  title: "BrandSignal — Sample",
  description: "Read-only sample of BrandSignal. Explore AI visibility tracking, competitor battlecards, citation analysis, and more.",
};

export default function DemoPage() {
  return <SovereignDashboard demoMode />;
}
