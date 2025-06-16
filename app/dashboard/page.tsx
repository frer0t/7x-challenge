"use client";

import { HabitStats } from "@/components/dashboard/HabitStats";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, Habit, HabitFormData, HabitStatsType } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<HabitStatsType>({
    totalHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    longestStreak: 0,
    completionRate: 0,
    categoryStats: [],
  });
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [habitFormLoading, setHabitFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError(null);
    try {
      await Promise.all([fetchHabits(), fetchCategories(), fetchStats()]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load dashboard data. Please refresh the page.");
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

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/habits/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleCreateHabit = async (habitData: HabitFormData) => {
    setHabitFormLoading(true);
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitData),
      });

      if (response.ok) {
        await fetchData();
        setShowHabitForm(false);
      }
    } catch (error) {
      console.error("Failed to create habit:", error);
    } finally {
      setHabitFormLoading(false);
    }
  };

  const handleUpdateHabit = async (habitData: HabitFormData) => {
    if (!editingHabit) return;

    setHabitFormLoading(true);
    try {
      const response = await fetch(`/api/habits/${editingHabit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitData),
      });

      if (response.ok) {
        await fetchData();
        setEditingHabit(undefined);
      }
    } catch (error) {
      console.error("Failed to update habit:", error);
    } finally {
      setHabitFormLoading(false);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Failed to delete habit:", error);
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      const habit = habits.find((h) => h.id === habitId);
      const today = new Date().toISOString().split("T")[0];

      if (habit?.isCompletedToday) {
        const response = await fetch(
          `/api/habits/completions?habitId=${habitId}&completedAt=${today}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          await fetchData();
        } else {
          const errorData = await response.json();
          console.error("Failed to uncomplete habit:", errorData);
        }
      } else {
        // Complete the habit
        const response = await fetch("/api/habits/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            habitId,
            completedAt: today,
            completedCount: 1,
          }),
        });

        if (response.ok) {
          await fetchData();
        } else {
          const errorData = await response.json();
          console.error("Failed to complete habit:", errorData);
        }
      }
    } catch (error) {
      console.error("Failed to toggle habit:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading overview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Overview</h1>
        <Button onClick={() => setShowHabitForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Habit
        </Button>
      </div>

      <div className="space-y-6">
        <HabitStats stats={stats} />

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {habits.slice(0, 6).map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={() => handleToggleHabit(habit.id)}
                  onEdit={() => setEditingHabit(habit)}
                  onDelete={() => handleDeleteHabit(habit.id)}
                />
              ))}
              {habits.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No habits yet. Create your first habit to get started!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <HabitForm
        habit={editingHabit}
        categories={categories}
        onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
        onCancel={() => {
          setShowHabitForm(false);
          setEditingHabit(undefined);
        }}
        isLoading={habitFormLoading}
        open={showHabitForm || !!editingHabit}
        onOpenChange={(open) => {
          if (!open) {
            setShowHabitForm(false);
            setEditingHabit(undefined);
          }
        }}
      />
    </div>
  );
};

export default Dashboard;
