"use client";

import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import type { ValidationError } from "@tanstack/react-form";
import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Context for form field
type FormFieldContextValue = {
  name: string;
  error?: string | ValidationError;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null
);

// Form field component for TanStack Form
interface FormFieldProps {
  // biome-ignore lint/suspicious/noExplicitAny: Needed for TanStack Form compatibility
  children: (fieldApi: any) => React.ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: Needed for TanStack Form compatibility
  fieldApi: any;
}

const FormField = ({ children, fieldApi }: FormFieldProps) => {
  const error = fieldApi.state.meta.errors?.[0];

  return (
    <FormFieldContext.Provider
      value={{
        name: fieldApi.name,
        error: typeof error === "string" ? error : error?.message,
        isValid: !fieldApi.state.meta.errors?.length,
        isDirty: fieldApi.state.meta.isDirty,
        isTouched: fieldApi.state.meta.isTouched,
      }}
    >
      {children(fieldApi)}
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    error: fieldContext.error,
    isValid: fieldContext.isValid,
    isDirty: fieldContext.isDirty,
    isTouched: fieldContext.isTouched,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error) : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
