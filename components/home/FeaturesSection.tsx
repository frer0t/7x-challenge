import { BarChart3, Calendar, Target } from "lucide-react";
import { FeatureItem } from "./FeatureItem";
import { HabitDemo } from "./HabitDemo";

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Everything You Need to Succeed
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Powerful features designed to help you build lasting habits
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <FeatureItem
            icon={Target}
            title="Smart Categories"
            description="Organize habits by Health, Productivity, Learning, and more. Color-coded for easy identification."
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <FeatureItem
            icon={Calendar}
            title="Calendar View"
            description="See your habit completion history at a glance with an intuitive calendar interface."
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <FeatureItem
            icon={BarChart3}
            title="Progress Charts"
            description="Beautiful visualizations showing completion rates, streaks, and trends over time."
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
