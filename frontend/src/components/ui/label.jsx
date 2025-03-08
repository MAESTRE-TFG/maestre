// Label component extends from shadcnui - https://ui.shadcn.com/docs/components/label

"use client";
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const Label = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  return (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", theme === "dark" ? "text-white" : "text-black", className)}
    {...props} />
  );
});
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
