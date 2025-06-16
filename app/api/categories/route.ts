import { db } from "@/lib/db/drizzle";
import { categories } from "@/lib/db/schema";
import { createCategorySchema } from "@/lib/validations/categories";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allCategories = await db.select().from(categories);
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);

    const newCategory = {
      id: nanoid(),
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [category] = await db
      .insert(categories)
      .values(newCategory)
      .returning();
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
