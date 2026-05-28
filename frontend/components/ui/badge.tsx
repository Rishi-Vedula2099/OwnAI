import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants: Record<string, string> = {
    default: "bg-brand-500/15 text-brand-300 border-brand-500/20",
    success: "bg-success/15 text-green-300 border-success/20",
    warning: "bg-warning/15 text-amber-300 border-warning/20",
    error: "bg-error/15 text-red-300 border-error/20",
    info: "bg-info/15 text-blue-300 border-info/20",
    outline: "bg-transparent text-text-secondary border-border",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
