import type { CreateHabitData } from "./api";
import type { Category, Habit, HabitStatsType } from "./dashboard";

export interface HabitCardProps {
  habit: Habit;
  onComplete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export interface HabitStatsProps {
  stats: HabitStatsType;
}

export interface HabitFormProps {
  habit?: Habit;
  categories: Category[];
  onSubmit: (data: CreateHabitData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
