import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { habitCompletions } from "@/lib/db/schema";
import { createHabitCompletionSchema } from "@/lib/validations/habits";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createHabitCompletionSchema.parse(body);

    // Check if completion already exists for today
    const existingCompletion = await db
      .select()
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.habitId, validatedData.habitId),
          eq(habitCompletions.userId, session.user.id),
          eq(
            habitCompletions.completedAt,
            validatedData.completedAt.toISOString().split("T")[0]
          )
        )
      )
      .limit(1);

    if (existingCompletion.length > 0) {
      return NextResponse.json(
        { error: "Habit already completed for this date" },
        { status: 409 }
      );
    }

    const completionId = nanoid();
    const [completion] = await db
      .insert(habitCompletions)
      .values({
        id: completionId,
        habitId: validatedData.habitId,
        userId: session.user.id,
        completedAt: validatedData.completedAt.toISOString().split("T")[0],
        completedCount: validatedData.completedCount,
      })
      .returning();

    return NextResponse.json(completion, { status: 201 });
  } catch (error) {
    console.error("Error creating habit completion:", error);
    return NextResponse.json(
      { error: "Failed to create habit completion" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get("habitId");
    const completedAt = searchParams.get("completedAt");

    if (!habitId || !completedAt) {
      return NextResponse.json(
        { error: "habitId and completedAt are required" },
        { status: 400 }
      );
    }

    const [deletedCompletion] = await db
      .delete(habitCompletions)
      .where(
        and(
          eq(habitCompletions.habitId, habitId),
          eq(habitCompletions.userId, session.user.id),
          eq(habitCompletions.completedAt, completedAt)
        )
      )
      .returning();

    if (!deletedCompletion) {
      return NextResponse.json(
        { error: "Habit completion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Habit completion removed" });
  } catch (error) {
    console.error("Error removing habit completion:", error);
    return NextResponse.json(
      { error: "Failed to remove habit completion" },
      { status: 500 }
    );
  }
}
