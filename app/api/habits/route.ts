import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { categories, habits } from "@/lib/db/schema";
import { createHabitSchema } from "@/lib/validations/habits";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userHabits = await db
      .select({
        id: habits.id,
        name: habits.name,
        description: habits.description,
        targetFrequency: habits.targetFrequency,
        isActive: habits.isActive,
        createdAt: habits.createdAt,
        updatedAt: habits.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          color: categories.color,
          icon: categories.icon,
        },
      })
      .from(habits)
      .leftJoin(categories, eq(habits.categoryId, categories.id))
      .where(eq(habits.userId, session.user.id))
      .orderBy(desc(habits.createdAt));

    return NextResponse.json(userHabits);
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
