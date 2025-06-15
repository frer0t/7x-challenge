import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Ready to Transform Your Life?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of people who are building better habits every day.
        </p>
        <Link href="/auth">
          <Button size="lg" className="text-lg px-12 py-6">
            Start Building Habits Today
          </Button>
        </Link>
      </div>
    </section>
  );
}
