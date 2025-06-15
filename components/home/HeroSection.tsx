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
          Build Better Habits,
          <span className="text-primary"> One Day at a Time</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Track your daily habits, visualize your progress, and stay motivated
          with beautiful charts and streak tracking. Transform your life through
          consistent action.
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
