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
