import type { z } from "zod";
import type { signInSchema, signUpSchema } from "@/lib/validations/auth";

// Inferred types from validation schemas
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;

// Auth state types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
}

// Auth component props
export interface AuthFormProps {
  onToggleMode?: () => void;
  isLoading?: boolean;
}
