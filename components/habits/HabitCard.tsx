import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Habit } from "@/types";
import { Check, Edit, MoreVertical, Target, Trash2 } from "lucide-react";
import { useState } from "react";

interface HabitCardProps {
  habit: Habit;
  onComplete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

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

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{habit.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(habit)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(habit.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {habit.description && (
            <p className="text-xs text-muted-foreground">{habit.description}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {habit.category && (
                <Badge
                  variant="secondary"
                  style={{ backgroundColor: habit.category.color + "20" }}
                  className="text-xs"
                >
                  {habit.category.name}
                </Badge>
              )}
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                <span>{habit.targetFrequency}/day</span>
              </div>
            </div>

            <Button
              variant={habit.isCompletedToday ? "default" : "outline"}
              size="sm"
              onClick={handleComplete}
              disabled={isCompleting}
              className="h-8"
            >
              <Check className="h-3 w-3 mr-1" />
              {habit.isCompletedToday ? "Done" : "Mark Done"}
            </Button>
          </div>

          <div className="flex justify-between text-xs">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-muted-foreground">Streak: </span>
                <span className="font-medium">
                  {habit.currentStreak || 0} days
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Rate: </span>
                <span className="font-medium">
                  {habit.completionRate || 0}%
                </span>
              </div>
            </div>
          </div>

          {habit.completionRate !== undefined && (
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${habit.completionRate}%` }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
