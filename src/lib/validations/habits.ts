import { z } from "zod";

// Category validation schemas
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be less than 50 characters"),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color")
    .optional(),
  icon: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Habit validation schemas
export const createHabitSchema = z.object({
  name: z
    .string()
    .min(1, "Habit name is required")
    .max(100, "Habit name must be less than 100 characters"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  targetFrequency: z
    .number()
    .int()
    .min(1, "Target frequency must be at least 1")
    .max(10, "Target frequency cannot exceed 10 per day"),
});

export const updateHabitSchema = createHabitSchema.partial();

// Habit completion validation schemas
export const createHabitCompletionSchema = z.object({
  habitId: z.string().min(1, "Habit ID is required"),
  completedAt: z
    .string()
    .or(z.date())
    .transform((val) => {
      if (typeof val === "string") {
        return new Date(val);
      }
      return val;
    }),
  completedCount: z
    .number()
    .int()
    .min(1, "Completed count must be at least 1")
    .optional()
    .default(1),
});

// Type exports
export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
export type CreateHabitData = z.infer<typeof createHabitSchema>;
export type UpdateHabitData = z.infer<typeof updateHabitSchema>;
export type CreateHabitCompletionData = z.infer<
  typeof createHabitCompletionSchema
>;
