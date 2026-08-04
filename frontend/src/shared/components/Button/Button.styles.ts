import clsx from "clsx";

import type { ButtonVariant } from "./Button.types";

export function buttonStyles(
  variant: ButtonVariant = "primary",
  fullWidth = false,
  className?: string,
) {
  return clsx(
    // Base
    "inline-flex items-center justify-center gap-2",
    "h-12 px-5",
    "rounded-xl",
    "text-sm font-medium",
    "transition-all duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-4",
    "disabled:pointer-events-none",
    "disabled:opacity-60",
    "select-none",

    fullWidth && "w-full",

    // Variants
    {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-200 shadow-sm hover:shadow-md",

        secondary:
        "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100",

        outline:
        "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",

        ghost:
        "bg-transparent text-slate-900 hover:bg-slate-100",

        destructive:
        "bg-red-600 text-white hover:bg-red-700",
    }[variant],

    className,
  );
}