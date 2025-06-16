import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center max-w-4xl mx-auto">
        <Badge variant="secondary" className="mb-4">
          <Zap className="h-4 w-4 mr-1" />
          Simple & Powerful
        </Badge>
        <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight">
          Track Your Daily Habits,
          <span className="text-primary"> Build Your Best Life</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          The 7x Challenge helps you create and maintain positive habits across
          6 key areas: Health, Productivity, Learning, Personal Growth, Social,
          and Creativity. Track completions, visualize progress, and build
          lasting streaks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/auth">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Your Journey
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
