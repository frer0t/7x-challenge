import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { categories, habitCompletions, habits } from "@/lib/db/schema";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get habits with completion data
    const habitsWithCompletions = await db
      .select({
        id: habits.id,
        name: habits.name,
        targetFrequency: habits.targetFrequency,
        category: {
          id: categories.id,
          name: categories.name,
          color: categories.color,
          icon: categories.icon,
        },
        completions: sql<number>`COUNT(${habitCompletions.id})`,
        totalDays: sql<number>`${days}`,
      })
      .from(habits)
      .leftJoin(categories, eq(habits.categoryId, categories.id))
      .leftJoin(
        habitCompletions,
        and(
          eq(habitCompletions.habitId, habits.id),
          gte(
            habitCompletions.completedAt,
            startDate.toISOString().split("T")[0]
          )
        )
      )
      .where(and(eq(habits.userId, session.user.id), eq(habits.isActive, true)))
      .groupBy(
        habits.id,
        categories.id,
        categories.name,
        categories.color,
        categories.icon
      )
      .orderBy(desc(habits.createdAt));

    // Get completion rates by category
    const categoryStats = await db
      .select({
        categoryId: categories.id,
        categoryName: categories.name,
        categoryColor: categories.color,
        totalHabits: sql<number>`COUNT(DISTINCT ${habits.id})`,
        totalCompletions: sql<number>`COUNT(${habitCompletions.id})`,
        possibleCompletions: sql<number>`SUM(${habits.targetFrequency}) * ${days}`,
      })
      .from(habits)
      .leftJoin(categories, eq(habits.categoryId, categories.id))
      .leftJoin(
        habitCompletions,
        and(
          eq(habitCompletions.habitId, habits.id),
          gte(
            habitCompletions.completedAt,
            startDate.toISOString().split("T")[0]
          )
        )
      )
      .where(and(eq(habits.userId, session.user.id), eq(habits.isActive, true)))
      .groupBy(categories.id, categories.name, categories.color)
      .having(sql`COUNT(DISTINCT ${habits.id}) > 0`);

    // Get recent completions for streak calculation
    const recentCompletions = await db
      .select({
        habitId: habitCompletions.habitId,
        completedAt: habitCompletions.completedAt,
        completedCount: habitCompletions.completedCount,
      })
      .from(habitCompletions)
      .innerJoin(habits, eq(habitCompletions.habitId, habits.id))
      .where(
        and(
          eq(habits.userId, session.user.id),
          gte(
            habitCompletions.completedAt,
            startDate.toISOString().split("T")[0]
          )
        )
      )
      .orderBy(desc(habitCompletions.completedAt));

    // Calculate streaks for each habit
    const habitStreaks = habitsWithCompletions.map((habit) => {
      const habitCompletionDates = recentCompletions
        .filter((comp) => comp.habitId === habit.id)
        .map((comp) => comp.completedAt)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let currentStreak = 0;
      let longestStreak = 0;
      let streak = 0;

      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      // Check if today or yesterday has completion for current streak
      const hasRecentCompletion =
        habitCompletionDates.includes(today) ||
        habitCompletionDates.includes(yesterday);

      if (hasRecentCompletion) {
        const sortedDates = [...new Set(habitCompletionDates)].sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );

        for (let i = 0; i < sortedDates.length; i++) {
          const currentDate = new Date(sortedDates[i]);
          const expectedDate = new Date();
          expectedDate.setDate(expectedDate.getDate() - i);

          const currentDateStr = currentDate.toISOString().split("T")[0];
          const expectedDateStr = expectedDate.toISOString().split("T")[0];

          if (currentDateStr === expectedDateStr) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Calculate longest streak
      for (const date of habitCompletionDates) {
        console.log("Current :", date);
        streak++;
        longestStreak = Math.max(longestStreak, streak);
      }

      return {
        ...habit,
        currentStreak,
        longestStreak,
        completionRate: Math.round(
          (Number(habit.completions) / (habit.targetFrequency * days)) * 100
        ),
      };
    });

    const stats = {
      habits: habitStreaks,
      categoryStats: categoryStats.map((cat) => ({
        ...cat,
        completionRate: Math.round(
          (Number(cat.totalCompletions) / Number(cat.possibleCompletions)) * 100
        ),
      })),
      totalHabits: habitsWithCompletions.length,
      totalCompletions: recentCompletions.length,
      averageCompletionRate: Math.round(
        habitStreaks.reduce((sum, habit) => sum + habit.completionRate, 0) /
          habitStreaks.length || 0
      ),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching habit stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch habit statistics" },
      { status: 500 }
    );
  }
}
