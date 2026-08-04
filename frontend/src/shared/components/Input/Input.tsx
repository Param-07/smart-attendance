import { forwardRef, useId } from "react";
import clsx from "clsx";

import type { InputProps } from "./Input.types";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      endAdornment,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={clsx(
              "w-full rounded-lg border px-3 py-2 text-sm",
              "border-gray-300 bg-white text-gray-900",
              "placeholder:text-gray-400",
              "transition-colors duration-200",
              "focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20",
              "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              endAdornment && "pr-10",
              className,
            )}
            {...props}
          />

          {endAdornment && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              {endAdornment}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="text-sm text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;