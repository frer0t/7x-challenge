"use client";

import { useForm } from "@tanstack/react-form";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ZodError } from "zod";
import { signUpAction } from "@/app/actions/auth";
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
import {
  confirmPasswordSchema,
  emailSchema,
  nameSchema,
  passwordSchema,
  signUpSchema,
} from "@/lib/validations/auth";
import type { AuthFormProps } from "@/types";

export function SignUpForm({ onToggleMode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { refetch } = useSession();
  const { push } = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        setError(null);
        setSuccess(false);

        try {
          // Final validation with the complete schema including password matching
          const validatedData = signUpSchema.parse(value);
          const result = await signUpAction(validatedData);

          if (result.success) {
            setSuccess(true);
            form.reset();
            refetch();
            push("/dashboard");
          } else {
            setError(result.error || "Failed to create account");
          }
        } catch (err) {
          console.error("Sign up error:", err);
          if (err instanceof ZodError) {
            setError(err.errors[0]?.message || "Please check your input");
          } else {
            setError("An unexpected error occurred. Please try again.");
          }
        }
      });
    },
  });

  const password = form.getFieldValue("password");

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl mb-2 text-foreground">
              Account Created!
            </CardTitle>
            <CardDescription className="mb-4 text-muted-foreground">
              Your account has been successfully created. Redirecting you to
              your dashboard...
            </CardDescription>
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl text-foreground">
            Create account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Start your habit tracking journey today
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
              name="name"
              validators={{
                onChange: ({ value }) => {
                  try {
                    nameSchema.parse(value);
                    return undefined;
                  } catch (error) {
                    if (error instanceof ZodError) {
                      return error.errors[0]?.message || "Invalid name";
                    }
                    return "Invalid name";
                  }
                },
              }}
            >
              {(field) => (
                <FormField fieldApi={field}>
                  {() => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
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
                  try {
                    passwordSchema.parse(value);
                    return undefined;
                  } catch (error) {
                    if (error instanceof ZodError) {
                      return error.errors[0]?.message || "Invalid password";
                    }
                    return "Invalid password";
                  }
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
                            placeholder="Create a password"
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
                      {password && password.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <p>Password must contain:</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li
                              className={
                                password.length >= 8
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              At least 8 characters
                            </li>
                            <li
                              className={
                                /[A-Z]/.test(password)
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              One uppercase letter
                            </li>
                            <li
                              className={
                                /[a-z]/.test(password)
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              One lowercase letter
                            </li>
                            <li
                              className={
                                /\d/.test(password)
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              One number
                            </li>
                          </ul>
                        </div>
                      )}
                    </FormItem>
                  )}
                </FormField>
              )}
            </form.Field>

            <form.Field
              name="confirmPassword"
              validators={{
                onChange: ({ value, fieldApi }) => {
                  try {
                    confirmPasswordSchema.parse(value);
                    const password = fieldApi.form.getFieldValue("password");
                    if (value !== password) {
                      return "Passwords don't match";
                    }
                    return undefined;
                  } catch (error) {
                    if (error instanceof ZodError) {
                      return error.errors[0]?.message || "Invalid confirmation";
                    }
                    return "Invalid confirmation";
                  }
                },
              }}
            >
              {(field) => (
                <FormField fieldApi={field}>
                  {() => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
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
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
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
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          {onToggleMode && (
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal text-primary hover:text-primary/80"
                  onClick={onToggleMode}
                >
                  Sign in
                </Button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
