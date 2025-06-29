import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Ready to Start Your 7x Challenge?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join the habit tracking revolution. Create your account and start
          building positive habits across all areas of your life today.
        </p>
        <Link href="/auth">
          <Button size="lg" className="text-lg px-12 py-6">
            Start Your Habit Journey
          </Button>
        </Link>
      </div>
    </section>
  );
}
