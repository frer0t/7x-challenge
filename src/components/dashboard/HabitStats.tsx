"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { HabitStatsProps } from "@/types";

export function HabitStats({ stats }: HabitStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
          <div className="w-4 h-4 bg-blue-500 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalHabits}</div>
          <p className="text-xs text-muted-foreground">Active habits tracked</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          <div className="w-4 h-4 bg-green-500 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.completedToday}/{stats.totalHabits}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalHabits > 0
              ? `${Math.round(
                  (stats.completedToday / stats.totalHabits) * 100
                )}% complete`
              : "No habits yet"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <div className="w-4 h-4 bg-orange-500 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.currentStreak}</div>
          <p className="text-xs text-muted-foreground">days in a row</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
          <div className="w-4 h-4 bg-purple-500 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.longestStreak}</div>
          <p className="text-xs text-muted-foreground">personal best</p>
        </CardContent>
      </Card>

      {/* Category Statistics */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Category Completion Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.categoryStats.map((category) => (
              <div key={category.categoryName} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.categoryName}</span>
                    <Badge variant="outline">
                      {category.completed}/{category.total}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(category.rate)}%
                  </span>
                </div>
                <Progress value={category.rate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
