export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  targetFrequency: number;
  categoryId?: string;
  category: Category | null;
  currentStreak?: number;
  completionRate?: number;
  isCompletedToday?: boolean;
}

export interface HabitStatsType {
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  categoryStats: CategoryStat[];
}

export interface CategoryStat {
  categoryName: string;
  color: string;
  completed: number;
  total: number;
  rate: number;
}

export interface HabitFormData {
  name: string;
  description?: string;
  targetFrequency: number;
  categoryId?: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAt: string;
  completedCount: number;
}

export interface AnalyticsData {
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
}
