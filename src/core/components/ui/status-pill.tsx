import * as React from "react";
import { cn } from "@/core/components/ui/utils";

type StatusVariant =
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "secondary"
  | "default";

interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusVariant;
  children: React.ReactNode;
}

// Reconectado a los tokens --color-status-* (ver styles/theme.css). Los valores
// de los tokens replican los colores previos (emerald-400 / amber-400 / red-400
// + hex) y se conservan los mismos niveles de opacidad; la apariencia no cambia.
const dotColors: Record<StatusVariant, string> = {
  success: "bg-status-success",
  warning: "bg-status-warning",
  destructive: "bg-status-destructive",
  info: "bg-status-info",
  secondary: "bg-status-secondary/60",
  default: "bg-status-default/60",
};

const textColors: Record<StatusVariant, string> = {
  success: "text-status-success/90",
  warning: "text-status-warning/90",
  destructive: "text-status-destructive/90",
  info: "text-status-info/90",
  secondary: "text-status-secondary",
  default: "text-status-default/80",
};

export function StatusPill({
  variant = "default",
  children,
  className,
  ...props
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs capitalize",
        textColors[variant],
        className
      )}
      {...props}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant])} />
      {children}
    </span>
  );
}


