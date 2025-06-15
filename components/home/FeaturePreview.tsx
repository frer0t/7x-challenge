import { BarChart3, CheckCircle2, TrendingUp } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeaturePreview() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-16">
      <FeatureCard
        icon={CheckCircle2}
        title="Track Daily Progress"
        description="Mark habits as complete with a simple click. Build momentum with visual feedback."
        iconColor="text-green-600"
      />
      <FeatureCard
        icon={BarChart3}
        title="Beautiful Analytics"
        description="Visualize your progress with charts and graphs. See patterns and celebrate wins."
        iconColor="text-blue-600"
      />
      <FeatureCard
        icon={TrendingUp}
        title="Streak Tracking"
        description="Build powerful streaks and maintain consistency. Watch your longest streaks grow."
        iconColor="text-purple-600"
      />
    </div>
  );
}
