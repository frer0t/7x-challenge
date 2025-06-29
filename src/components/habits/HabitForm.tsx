import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
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
import { createHabitSchema } from "@/lib/validations/habits";
import type { CreateHabitData, HabitFormProps } from "@/types";

export function HabitForm({
  habit,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
  open = false,
  onOpenChange,
}: HabitFormProps) {
  const form = useForm<CreateHabitData>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      name: habit?.name || "",
      description: habit?.description || "",
      targetFrequency: habit?.targetFrequency || 1,
      categoryId: habit?.categoryId || "",
    },
  });

  // Reset form when habit changes
  useEffect(() => {
    if (habit) {
      form.reset({
        name: habit.name || "",
        description: habit.description || "",
        targetFrequency: habit.targetFrequency || 1,
        categoryId: habit.categoryId || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        targetFrequency: 1,
        categoryId: "",
      });
    }
  }, [habit, form]);

  const handleSubmit = async (data: CreateHabitData) => {
    await onSubmit(data);
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange?.(false);
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Read for 30 minutes"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief description of your habit"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
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
            );
          }}
        />

        <FormField
          control={form.control}
          name="targetFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Frequency (per day)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  disabled={isLoading}
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 1)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
    </Form>
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
