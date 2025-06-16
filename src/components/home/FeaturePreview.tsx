import { BarChart3, CheckCircle2, TrendingUp } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeaturePreview() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-16">
      <FeatureCard
        icon={CheckCircle2}
        title="Daily Habit Completion"
        description="Mark habits as complete with a simple click. Track across 6 categories with visual feedback."
        iconColor="text-green-600"
      />
      <FeatureCard
        icon={BarChart3}
        title="Comprehensive Analytics"
        description="View completion rates, category breakdowns, and progress trends with beautiful charts and graphs."
        iconColor="text-blue-600"
      />
      <FeatureCard
        icon={TrendingUp}
        title="Streak & Motivation"
        description="Build powerful streaks and maintain consistency. Monitor current and longest streaks to stay motivated."
        iconColor="text-purple-600"
      />
    </div>
  );
}
