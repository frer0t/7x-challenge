"use client";

import { Activity, BarChart3, Clock, Target, TrendingUp } from "lucide-react";
import { AnalyticsCard } from "@/components/analytics/AnalyticsCard";
import {
  AreaChartCard,
  BarChartCard,
  PieChartCard,
} from "@/components/analytics/ChartComponents";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AnalyticsDashboardProps } from "@/types";

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const categoryData = data.habitPerformance.reduce(
    (acc, habit) => {
      const existing = acc.find((item) => item.name === habit.category);
      if (existing) {
        existing.completions += habit.completions;
        existing.target += habit.target;
      } else {
        acc.push({
          name: habit.category,
          completions: habit.completions,
          target: habit.target,
          value: habit.completions,
          color: habit.color,
        });
      }
      return acc;
    },
    [] as Array<{
      name: string;
      completions: number;
      target: number;
      value: number;
      color: string;
    }>
  );

  const peakHours = data.timeOfDay
    .filter((hour) => hour.completions > 0)
    .sort((a, b) => b.completions - a.completions)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Completions"
          value={data.summary.totalCompletions}
          description="in the last 30 days"
          icon={Activity}
        />
        <AnalyticsCard
          title="Daily Average"
          value={data.summary.averageDaily}
          description="completions per day"
          icon={BarChart3}
        />
        <AnalyticsCard
          title="Best Day"
          value={data.summary.bestDay.completions}
          description={`${data.summary.bestDay.day} completions`}
          icon={TrendingUp}
        />
        <AnalyticsCard
          title="Peak Hour"
          value={data.summary.mostProductiveHour.time}
          description={`${data.summary.mostProductiveHour.completions} completions`}
          icon={Clock}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <AreaChartCard
          title="Daily Completions"
          description="Your habit completion trend over the last 30 days"
          data={data.dailyCompletions}
          dataKey="completions"
          xAxisKey="day"
          color="#8884d8"
        />

        <BarChartCard
          title="Weekly Trends"
          description="Weekly completion averages"
          data={data.weeklyTrends}
          dataKey="average"
          xAxisKey="week"
          color="#82ca9d"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PieChartCard
          title="Completions by Category"
          description="Distribution of habit completions across categories"
          data={categoryData}
          dataKey="value"
          nameKey="name"
          colors={categoryData.map((cat) => cat.color)}
        />

        <BarChartCard
          title="Peak Activity Hours"
          description="When you're most active with your habits"
          data={data.timeOfDay.filter((hour) => hour.completions > 0)}
          dataKey="completions"
          xAxisKey="time"
          color="#ffc658"
        />
      </div>

      {/* Habit Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Habit Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.habitPerformance.map((habit, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div>
                      <p className="font-medium">{habit.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {habit.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {habit.completions}/{habit.target}
                    </Badge>
                    <span className="text-sm font-medium min-w-[3rem] text-right">
                      {habit.rate}%
                    </span>
                  </div>
                </div>
                <Progress value={habit.rate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Peak Hours Insight */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Your Peak Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {peakHours.map((hour, index) => (
              <div
                key={hour.hour}
                className="text-center p-4 border rounded-lg"
              >
                <div className="text-2xl font-bold text-primary">
                  {hour.time}
                </div>
                <div className="text-sm text-muted-foreground">
                  {hour.completions} completions
                </div>
                <Badge variant="secondary" className="mt-2">
                  #{index + 1} Peak
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
