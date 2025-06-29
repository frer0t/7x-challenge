import type { z } from "zod";
import type {
  createCategorySchema,
  updateCategorySchema,
} from "@/lib/validations/categories";
import type {
  createHabitCompletionSchema,
  createHabitSchema,
  updateHabitSchema,
} from "@/lib/validations/habits";

// Inferred types from validation schemas
export type CreateHabitData = z.infer<typeof createHabitSchema>;
export type UpdateHabitData = z.infer<typeof updateHabitSchema>;
export type CreateHabitCompletionData = z.infer<
  typeof createHabitCompletionSchema
>;

export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Database entity types (matching the actual database schema)
export interface HabitEntity {
  id: string;
  name: string;
  description?: string;
  targetFrequency: number;
  categoryId?: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryEntity {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitCompletionEntity {
  id: string;
  habitId: string;
  userId: string;
  completedAt: string; // ISO date string
  completedCount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
