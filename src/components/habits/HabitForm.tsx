import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { ZodError } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createHabitSchema,
  habitDescriptionSchema,
  habitNameSchema,
  targetFrequencySchema,
} from "@/lib/validations/habits";
import type { HabitFormProps } from "@/types";

export function HabitForm({
  habit,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
  open = false,
  onOpenChange,
}: HabitFormProps) {
  const form = useForm({
    defaultValues: {
      name: habit?.name || "",
      description: habit?.description || "",
      targetFrequency: habit?.targetFrequency || 1,
      categoryId: habit?.categoryId || "",
    },
    onSubmit: async ({ value }) => {
      // Validate with Zod before submitting
      try {
        const validatedData = createHabitSchema.parse(value);
        await onSubmit(validatedData);
        onOpenChange?.(false);
      } catch (error) {
        if (error instanceof ZodError) {
          console.error("Validation error:", error.errors);
          // Let the field-level validation handle showing errors
        } else {
          console.error("Submission error:", error);
        }
      }
    },
  });

  // Reset form when habit changes
  useEffect(() => {
    if (habit) {
      form.setFieldValue("name", habit.name || "");
      form.setFieldValue("description", habit.description || "");
      form.setFieldValue("targetFrequency", habit.targetFrequency || 1);
      form.setFieldValue("categoryId", habit.categoryId || "");
    } else {
      form.reset();
    }
  }, [habit, form]);

  const handleCancel = () => {
    onCancel();
    onOpenChange?.(false);
  };

  const formContent = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            try {
              habitNameSchema.parse(value);
              return undefined;
            } catch (error) {
              if (error instanceof ZodError) {
                return error.errors[0]?.message || "Invalid habit name";
              }
              return "Invalid habit name";
            }
          },
        }}
      >
        {(field) => (
          <FormField fieldApi={field}>
            {() => (
              <FormItem>
                <FormLabel>Habit Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Read for 30 minutes"
                    disabled={isLoading}
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
        name="description"
        validators={{
          onChange: ({ value }) => {
            try {
              habitDescriptionSchema.parse(value);
              return undefined;
            } catch (error) {
              if (error instanceof ZodError) {
                return error.errors[0]?.message || "Invalid description";
              }
              return "Invalid description";
            }
          },
        }}
      >
        {(field) => (
          <FormField fieldApi={field}>
            {() => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Brief description of your habit"
                    disabled={isLoading}
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
        name="categoryId"
        validators={{
          onChange: () => {
            // Category is optional, so no required validation
            return undefined;
          },
        }}
      >
        {(field) => (
          <FormField fieldApi={field}>
            {() => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) => field.handleChange(value)}
                  value={field.state.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          {category.color && (
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                          )}
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          </FormField>
        )}
      </form.Field>

      <form.Field
        name="targetFrequency"
        validators={{
          onChange: ({ value }) => {
            try {
              targetFrequencySchema.parse(value);
              return undefined;
            } catch (error) {
              if (error instanceof ZodError) {
                return error.errors[0]?.message || "Invalid target frequency";
              }
              return "Invalid target frequency";
            }
          },
        }}
      >
        {(field) => (
          <FormField fieldApi={field}>
            {() => (
              <FormItem>
                <FormLabel>Target Frequency (per day)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    disabled={isLoading}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(parseInt(e.target.value) || 1)
                    }
                    onBlur={field.handleBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </FormField>
        )}
      </form.Field>

      <div className="flex space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Saving..." : habit ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );

  if (onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {habit ? "Edit Habit" : "Create New Habit"}
            </DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{habit ? "Edit Habit" : "Create New Habit"}</CardTitle>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
