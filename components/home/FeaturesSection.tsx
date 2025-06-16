import { BarChart3, Calendar, Target } from "lucide-react";
import { FeatureItem } from "./FeatureItem";
import { HabitDemo } from "./HabitDemo";

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Everything You Need to Build Lasting Habits
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Comprehensive habit tracking with analytics, streaks, and beautiful
          visualizations
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <FeatureItem
            icon={Target}
            title="6 Smart Categories"
            description="Organize habits across Health, Productivity, Learning, Personal, Social, and Creativity. Each category is color-coded for easy identification."
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <FeatureItem
            icon={Calendar}
            title="Daily Completion Tracking"
            description="Mark habits complete each day and see your completion history with an intuitive interface and calendar view."
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <FeatureItem
            icon={BarChart3}
            title="Analytics & Streaks"
            description="Beautiful charts showing completion rates, current and longest streaks, and trends over time to keep you motivated."
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        <div className="lg:pl-8">
          <HabitDemo />
        </div>
      </div>
    </section>
  );
}
