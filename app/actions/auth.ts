"use server";
import { auth } from "@/lib/auth";
import {
  signInSchema,
  signUpSchema,
  type SignInFormData,
  type SignUpFormData,
} from "@/lib/validations/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInAction(data: SignInFormData) {
  try {
    const validatedData = signInSchema.parse(data);
    const headersList = await headers();

    await auth.api.signInEmail({
      body: validatedData,
      headers: headersList,
    });

    return { success: true };
  } catch (error) {
    console.error("Sign in error:", error);

    if (error instanceof Error) {
      if (error.message.includes("Invalid email or password")) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function signUpAction(data: SignUpFormData) {
  try {
    const validatedData = signUpSchema.parse(data);
    const headersList = await headers();
    const { confirmPassword, ...authData } = validatedData;

    await auth.api.signUpEmail({
      body: authData,
      headers: headersList,
    });

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);

    if (error instanceof Error) {
      if (error.message.includes("User already exists")) {
        return {
          success: false,
          error: "An account with this email already exists",
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function signOutAction() {
  try {
    const headersList = await headers();
    await auth.api.signOut({
      headers: headersList,
    });

    redirect("/");
  } catch (error) {
    console.error("Sign out error:", error);
    redirect("/");
  }
}
