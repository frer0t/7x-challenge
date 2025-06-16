import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { HabitCardProps } from "@/types";
import {
  Check,
  Edit,
  Flame,
  MoreVertical,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export function HabitCard({
  habit,
  onComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await onComplete(habit.id);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleEdit = () => {
    onEdit(habit);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      onDelete(habit.id);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-3 h-8 rounded-full"
                style={{ backgroundColor: habit.category?.color || "#6366f1" }}
              />
              <div>
                <h3 className="font-semibold text-lg leading-tight">
                  {habit.name}
                </h3>
                {habit.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {habit.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Habit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Habit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Category and Target */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {habit.category && (
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1"
                style={{
                  backgroundColor: habit.category.color + "15",
                  color: habit.category.color,
                  border: `1px solid ${habit.category.color}25`,
                }}
              >
                {habit.category.name}
              </Badge>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Target className="h-3 w-3" />
              <span>{habit.targetFrequency}/day</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {habit.completionRate || 0}%
            </span>
          </div>
          <Progress
            value={habit.completionRate || 0}
            className="h-2"
            style={{
              backgroundColor: habit.category?.color + "20" || "#6366f120",
            }}
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Streak</p>
              <p className="font-semibold">{habit.currentStreak || 0} days</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rate</p>
              <p className="font-semibold">{habit.completionRate || 0}%</p>
            </div>
          </div>
        </div>

        {/* Complete Button */}
        <Button
          onClick={handleComplete}
          disabled={isCompleting}
          className={`w-full h-12 text-base font-medium transition-all duration-200 ${
            habit.isCompletedToday
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {isCompleting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Updating...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              {habit.isCompletedToday ? "Completed Today!" : "Mark as Done"}
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
