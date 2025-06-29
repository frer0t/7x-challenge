import { and, desc, eq, gte } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { categories, habitCompletions, habits } from "@/lib/db/schema";
import { createHabitSchema } from "@/lib/validations/habits";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split("T")[0];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const userHabits = await db
      .select({
        id: habits.id,
        name: habits.name,
        description: habits.description,
        targetFrequency: habits.targetFrequency,
        categoryId: habits.categoryId,
        isActive: habits.isActive,
        createdAt: habits.createdAt,
        updatedAt: habits.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          color: categories.color,
          icon: categories.icon,
        },
        isCompletedToday: habitCompletions.id,
      })
      .from(habits)
      .leftJoin(categories, eq(habits.categoryId, categories.id))
      .leftJoin(
        habitCompletions,
        and(
          eq(habitCompletions.habitId, habits.id),
          eq(habitCompletions.completedAt, today)
        )
      )
      .where(eq(habits.userId, session.user.id))
      .orderBy(desc(habits.createdAt));

    // Get all completions for streak calculation
    const allCompletions = await db
      .select({
        habitId: habitCompletions.habitId,
        completedAt: habitCompletions.completedAt,
      })
      .from(habitCompletions)
      .innerJoin(habits, eq(habitCompletions.habitId, habits.id))
      .where(eq(habits.userId, session.user.id))
      .orderBy(desc(habitCompletions.completedAt));

    // Get recent completions for completion rate (last 7 days)
    const recentCompletions = await db
      .select({
        habitId: habitCompletions.habitId,
      })
      .from(habitCompletions)
      .innerJoin(habits, eq(habitCompletions.habitId, habits.id))
      .where(
        and(
          eq(habits.userId, session.user.id),
          gte(habitCompletions.completedAt, sevenDaysAgoStr)
        )
      );

    // Transform the data to include boolean completion status and calculate streaks
    const transformedHabits = userHabits.map((habit) => {
      const habitCompletionDates = allCompletions
        .filter((comp) => comp.habitId === habit.id)
        .map((comp) => comp.completedAt)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let currentStreak = 0;
      let longestStreak = 0;

      // Calculate current streak
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

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
      let tempStreak = 0;
      const uniqueDates = [...new Set(habitCompletionDates)].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      for (let i = 0; i < uniqueDates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const prevDate = new Date(uniqueDates[i - 1]);
          const currDate = new Date(uniqueDates[i]);
          const diffTime = currDate.getTime() - prevDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      // Calculate completion rate (last 7 days)
      const recentHabitCompletions = recentCompletions.filter(
        (comp) => comp.habitId === habit.id
      ).length;
      const completionRate = Math.round(
        (recentHabitCompletions / (habit.targetFrequency * 7)) * 100
      );

      return {
        ...habit,
        isCompletedToday: !!habit.isCompletedToday,
        currentStreak,
        longestStreak,
        completionRate,
      };
    });

    return NextResponse.json(transformedHabits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createHabitSchema.parse(body);

    const newHabitId = nanoid();
    const [newHabit] = await db
      .insert(habits)
      .values({
        id: newHabitId,
        name: validatedData.name,
        description: validatedData.description,
        categoryId: validatedData.categoryId,
        userId: session.user.id,
        targetFrequency: validatedData.targetFrequency,
      })
      .returning();

    return NextResponse.json(newHabit, { status: 201 });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 }
    );
  }
}
