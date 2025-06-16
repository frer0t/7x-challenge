import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface ChartData {
  [key: string]: string | number;
}

export interface ChartContainerProps {
  title: string;
  children: ReactNode;
  description?: string;
}

export interface BarChartProps {
  title: string;
  data: ChartData[];
  dataKey: string;
  xAxisKey: string;
  description?: string;
  color?: string;
}

export interface PieChartProps {
  title: string;
  data: ChartData[];
  dataKey: string;
  nameKey: string;
  description?: string;
  colors?: string[];
}

export interface LineChartProps {
  title: string;
  data: ChartData[];
  dataKey: string;
  xAxisKey: string;
  description?: string;
  color?: string;
}

export interface AreaChartProps {
  title: string;
  data: ChartData[];
  dataKey: string;
  xAxisKey: string;
  description?: string;
  color?: string;
}

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  children?: ReactNode;
}

export interface AnalyticsDashboardProps {
  data: {
    dailyCompletions: Array<{
      date: string;
      day: string;
      completions: number;
    }>;
    weeklyTrends: Array<{
      week: string;
      weekStart: string;
      completions: number;
      average: number;
    }>;
    habitPerformance: Array<{
      name: string;
      completions: number;
      target: number;
      rate: number;
      category: string;
      color: string;
    }>;
    timeOfDay: Array<{
      hour: number;
      time: string;
      completions: number;
    }>;
    summary: {
      totalCompletions: number;
      averageDaily: number;
      bestDay: {
        date: string;
        day: string;
        completions: number;
      };
      mostProductiveHour: {
        hour: number;
        time: string;
        completions: number;
      };
    };
  };
}

export interface SkeletonProps {
  className?: string;
}
