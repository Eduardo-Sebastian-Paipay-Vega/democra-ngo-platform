import * as React from "react";
import { cn } from "@/core/components/ui/utils";

type StatusVariant =
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "secondary"
  | "default";

interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusVariant;
  children: React.ReactNode;
}

// Reconectado a los tokens --color-status-* (ver styles/theme.css). Los valores
// de los tokens replican los colores previos (emerald-400 / amber-400 / red-400
// + hex), así que la apariencia no cambia; ahora hay un único punto de ajuste.
const dotColors: Record<StatusVariant, string> = {
  success: "bg-status-success",
  warning: "bg-status-warning",
  destructive: "bg-status-destructive",
  info: "bg-status-info",
  secondary: "bg-status-secondary/50",
  default: "bg-status-default/40",
};

const textColors: Record<StatusVariant, string> = {
  success: "text-status-success",
  warning: "text-status-warning",
  destructive: "text-status-destructive",
  info: "text-status-info",
  secondary: "text-status-secondary",
  default: "text-status-default",
};

export function StatusDot({
  variant = "default",
  children,
  className,
  ...props
}: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12px]",
        textColors[variant],
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "h-[5px] w-[5px] rounded-full",
          dotColors[variant]
        )}
      />
      {children}
    </span>
  );
}


