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
    const days = parseInt(searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get daily completion data for the last period
    const dailyData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayCompletions = await db
        .select({
          count: sql<number>`COUNT(*)`,
        })
        .from(habitCompletions)
        .innerJoin(habits, eq(habitCompletions.habitId, habits.id))
        .where(
          and(
            eq(habits.userId, session.user.id),
            eq(habitCompletions.completedAt, dateStr)
          )
        );

      dailyData.push({
        date: dateStr,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        completions: Number(dayCompletions[0]?.count || 0),
      });
    }

    // Get weekly averages for the last 8 weeks
    const weeklyData = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i * 7 - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekCompletions = await db
        .select({
          count: sql<number>`COUNT(*)`,
        })
        .from(habitCompletions)
        .innerJoin(habits, eq(habitCompletions.habitId, habits.id))
        .where(
          and(
            eq(habits.userId, session.user.id),
            gte(
              habitCompletions.completedAt,
              weekStart.toISOString().split("T")[0]
            ),
            sql`${habitCompletions.completedAt} <= ${
              weekEnd.toISOString().split("T")[0]
            }`
          )
        );

      weeklyData.push({
        week: `Week ${8 - i}`,
        weekStart: weekStart.toISOString().split("T")[0],
        completions: Number(weekCompletions[0]?.count || 0),
        average:
          Math.round((Number(weekCompletions[0]?.count || 0) / 7) * 10) / 10,
      });
    }

    // Get habit performance data
    const habitPerformance = await db
      .select({
        id: habits.id,
        name: habits.name,
        targetFrequency: habits.targetFrequency,
        completions: sql<number>`COUNT(${habitCompletions.id})`,
        categoryName: categories.name,
        categoryColor: categories.color,
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
        habits.name,
        habits.targetFrequency,
        categories.name,
        categories.color
      )
      .orderBy(desc(sql`COUNT(${habitCompletions.id})`));

    const habitPerformanceWithRates = habitPerformance.map((habit) => ({
      name: habit.name,
      completions: Number(habit.completions),
      target: habit.targetFrequency * days,
      rate: Math.round(
        (Number(habit.completions) / (habit.targetFrequency * days)) * 100
      ),
      category: habit.categoryName || "Uncategorized",
      color: habit.categoryColor || "#6b7280",
    }));

    // Get time of day analysis
    const timeOfDayData = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${habitCompletions.createdAt})`,
        count: sql<number>`COUNT(*)`,
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
      .groupBy(sql`EXTRACT(HOUR FROM ${habitCompletions.createdAt})`)
      .orderBy(sql`EXTRACT(HOUR FROM ${habitCompletions.createdAt})`);

    const timeAnalysis = Array.from({ length: 24 }, (_, i) => {
      const hourData = timeOfDayData.find((d) => Number(d.hour) === i);
      return {
        hour: i,
        time: `${i.toString().padStart(2, "0")}:00`,
        completions: Number(hourData?.count || 0),
      };
    });

    const analyticsData = {
      dailyCompletions: dailyData,
      weeklyTrends: weeklyData,
      habitPerformance: habitPerformanceWithRates,
      timeOfDay: timeAnalysis,
      summary: {
        totalCompletions: dailyData.reduce(
          (sum, day) => sum + day.completions,
          0
        ),
        averageDaily:
          Math.round(
            (dailyData.reduce((sum, day) => sum + day.completions, 0) / days) *
              10
          ) / 10,
        bestDay: dailyData.reduce(
          (best, day) => (day.completions > best.completions ? day : best),
          dailyData[0]
        ),
        mostProductiveHour: timeAnalysis.reduce(
          (best, hour) => (hour.completions > best.completions ? hour : best),
          timeAnalysis[0]
        ),
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
