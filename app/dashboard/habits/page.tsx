"use client";

import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, Habit, HabitFormData } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const HabitsPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchHabits(), fetchCategories()]);
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
        await fetchData();
        setShowHabitForm(false);
      }
    } catch (error) {
      console.error("Failed to create habit:", error);
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
        await fetchData();
        setEditingHabit(undefined);
      }
    } catch (error) {
      console.error("Failed to update habit:", error);
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
      const response = await fetch("/api/habits/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitId,
          date: new Date().toISOString().split("T")[0],
          completed: true,
        }),
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Failed to toggle habit:", error);
    }
  };

  const groupedHabits = categories.reduce((acc, category) => {
    acc[category.name] = habits.filter(
      (habit) => habit.categoryId === category.id
    );
    return acc;
  }, {} as Record<string, Habit[]>);

  const uncategorizedHabits = habits.filter((habit) => !habit.categoryId);
  if (uncategorizedHabits.length > 0) {
    groupedHabits["Uncategorized"] = uncategorizedHabits;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading habits...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Habits</h1>
        <Button onClick={() => setShowHabitForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Habit
        </Button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedHabits).map(([categoryName, categoryHabits]) => (
          <Card key={categoryName}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {categories.find((c) => c.name === categoryName)?.color && (
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: categories.find(
                        (c) => c.name === categoryName
                      )?.color,
                    }}
                  />
                )}
                {categoryName}
                <span className="text-sm font-normal text-muted-foreground">
                  ({categoryHabits.length} habits)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onComplete={() => handleToggleHabit(habit.id)}
                    onEdit={() => setEditingHabit(habit)}
                    onDelete={() => handleDeleteHabit(habit.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {Object.keys(groupedHabits).length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                No habits found. Start building better habits today!
              </div>
              <Button onClick={() => setShowHabitForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Habit
              </Button>
            </CardContent>
          </Card>
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
  );
};

export default HabitsPage;
