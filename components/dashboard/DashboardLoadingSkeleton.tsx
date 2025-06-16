"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-9 w-32" /> {/* Overview title */}
        <Skeleton className="h-10 w-32" /> {/* New Habit button */}
      </div>

      <div className="space-y-6">
        {/* Stats Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {/* Stat Cards */}
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="w-4 h-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}

          {/* Category Statistics Card */}
          <Card className="md:col-span-2 lg:col-span-4 animate-pulse">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-3 h-3 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-12 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Habits Card Skeleton */}
        <Card className="animate-pulse">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-4 bg-gradient-to-br from-background to-muted/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Habit Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton className="w-3 h-6 rounded-full bg-gradient-to-r from-blue-200 to-blue-300" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-28 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>

                  {/* Category and Target */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full bg-gradient-to-r from-muted to-muted-foreground/20" />
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded" />
                      <div>
                        <Skeleton className="h-3 w-12 mb-1" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded" />
                      <div>
                        <Skeleton className="h-3 w-8 mb-1" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  </div>

                  {/* Complete Button */}
                  <Skeleton className="h-10 w-full rounded-md bg-gradient-to-r from-primary/20 to-primary/30" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
