"use client";

import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { HabitsLoadingSkeleton } from "@/components/habits/HabitsLoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Category, Habit, HabitFormData } from "@/types";
import { Plus, RefreshCw, Target } from "lucide-react";
import { useEffect, useState } from "react";

const HabitsPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError(null);
    try {
      await Promise.all([fetchHabits(), fetchCategories()]);
    } catch (error) {
      setError("Failed to load data. Please try again.");
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHabits = async () => {
    try {
      const response = await fetch("/api/habits");
      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      }
    } catch (error) {
      console.error("Failed to fetch habits:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleCreateHabit = async (habitData: HabitFormData) => {
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitData),
      });

      if (response.ok) {
        await Promise.all([fetchHabits(), fetchCategories()]);
        setShowHabitForm(false);
      } else {
        throw new Error("Failed to create habit");
      }
    } catch (error) {
      console.error("Failed to create habit:", error);
      setError("Failed to create habit. Please try again.");
    }
  };

  const handleUpdateHabit = async (habitData: HabitFormData) => {
    if (!editingHabit) return;

    try {
      const response = await fetch(`/api/habits/${editingHabit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitData),
      });

      if (response.ok) {
        await Promise.all([fetchHabits(), fetchCategories()]);
        setEditingHabit(undefined);
      } else {
        throw new Error("Failed to update habit");
      }
    } catch (error) {
      console.error("Failed to update habit:", error);
      setError("Failed to update habit. Please try again.");
    }
  };
  const handleDeleteHabit = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await Promise.all([fetchHabits(), fetchCategories()]);
      } else {
        throw new Error("Failed to delete habit");
      }
    } catch (error) {
      console.error("Failed to delete habit:", error);
      setError("Failed to delete habit. Please try again.");
    }
  };
  const handleToggleHabit = async (habitId: string) => {
    const originalHabits = [...habits];
    const today = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch("/api/habits/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitId,
          date: today,
          completed: true,
          completedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Refresh to get updated data
        await Promise.all([fetchHabits(), fetchCategories()]);
      } else {
        // Revert optimistic update on error
        setHabits(originalHabits);
        throw new Error("Failed to update habit");
      }
    } catch (error) {
      // Revert optimistic update on error
      setHabits(originalHabits);
      console.error("Failed to toggle habit:", error);
      setError("Failed to update habit completion. Please try again.");
    }
  };

  if (loading) {
    return <HabitsLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
            <p className="text-destructive mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Habits</h2>
          <Button onClick={() => setShowHabitForm(true)} size={"sm"}>
            <Plus className="w-4 h-4 mr-2" />
            New Habit
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Habits Grid */}
        <div className={`transition-opacity duration-200 `}>
          {habits.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={() => handleToggleHabit(habit.id)}
                  onEdit={() => setEditingHabit(habit)}
                  onDelete={() => handleDeleteHabit(habit.id)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Target className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No habits yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start building better habits today. Create your first habit and
                begin your journey to self-improvement.
              </p>
              <Button
                onClick={() => setShowHabitForm(true)}
                size="lg"
                className="h-12 px-8"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Habit
              </Button>
            </div>
          )}
        </div>

        {/* Habit Form Dialog */}
        <HabitForm
          habit={editingHabit}
          categories={categories}
          onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
          onCancel={() => {
            setShowHabitForm(false);
            setEditingHabit(undefined);
          }}
          open={showHabitForm || !!editingHabit}
          onOpenChange={(open) => {
            if (!open) {
              setShowHabitForm(false);
              setEditingHabit(undefined);
            }
          }}
        />
      </div>
    </div>
  );
};

export default HabitsPage;
