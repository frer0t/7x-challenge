import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { categories } from "@/lib/db/schema";
import { updateCategorySchema } from "@/lib/validations/categories";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  if (!resolvedParams.id) {
    return NextResponse.json(
      { error: "Category ID is required" },
      { status: 400 }
    );
  }
  try {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, resolvedParams.id));

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  if (!resolvedParams.id) {
    return NextResponse.json(
      { error: "Category ID is required" },
      { status: 400 }
    );
  }
  try {
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    const [updatedCategory] = await db
      .update(categories)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, resolvedParams.id))
      .returning();

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  if (!resolvedParams.id) {
    return NextResponse.json(
      { error: "Category ID is required" },
      { status: 400 }
    );
  }
  try {
    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, resolvedParams.id))
      .returning();

    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
