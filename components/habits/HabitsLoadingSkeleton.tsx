"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export function HabitsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 animate-in fade-in duration-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header - Show actual content instead of skeleton */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Habits</h2>
          <Button disabled className="opacity-50" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Habit
          </Button>
        </div>

        {/* Habits Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, habitIndex) => (
            <div key={habitIndex} className="group">
              <div
                className="border-0 bg-gradient-to-br from-background to-muted/20 rounded-lg p-6 space-y-4 animate-pulse"
                style={{ animationDelay: `${habitIndex * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="w-3 h-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>

                {/* Category and Target */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <div>
                      <Skeleton className="h-3 w-12 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <div>
                      <Skeleton className="h-3 w-8 mb-1" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>

                {/* Complete Button */}
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
