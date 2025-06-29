"use client";

import { useForm } from "@tanstack/react-form";
import { AlertCircle, Eye, EyeOff, Loader2, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ZodError } from "zod";
import { signInAction } from "@/app/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import { emailSchema, signInSchema } from "@/lib/validations/auth";
import type { AuthFormProps } from "@/types";
export function SignInForm({ onToggleMode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { refetch } = useSession();
  const { push } = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        setError(null);

        try {
          // Validate with Zod before submitting
          const validatedData = signInSchema.parse(value);
          const result = await signInAction(validatedData);

          if (result.success) {
            push("/dashboard");
            refetch();
          } else {
            setError(result.error || "Failed to sign in");
          }
        } catch (err) {
          console.error("Sign in error:", err);
          if (err instanceof ZodError) {
            setError(err.errors[0]?.message || "Please check your input");
          } else {
            setError("An unexpected error occurred. Please try again.");
          }
        }
      });
    },
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl text-foreground">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to continue building your habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  try {
                    emailSchema.parse(value);
                    return undefined;
                  } catch (error) {
                    if (error instanceof ZodError) {
                      return error.errors[0]?.message || "Invalid email";
                    }
                    return "Invalid email";
                  }
                },
              }}
            >
              {(field) => (
                <FormField fieldApi={field}>
                  {() => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                </FormField>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.length < 1) return "Password is required";
                  if (value.length < 8)
                    return "Password must be at least 8 characters long";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <FormField fieldApi={field}>
                  {() => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pr-10"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                </FormField>
              )}
            </form.Field>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {onToggleMode && (
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal text-primary hover:text-primary/80"
                  onClick={onToggleMode}
                >
                  Sign up
                </Button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
