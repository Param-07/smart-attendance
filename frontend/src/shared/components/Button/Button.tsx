import { Loader2 } from "lucide-react";

import { buttonStyles } from "./Button.styles";
import type { ButtonProps } from "./Button.types";

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles(
        variant,
        fullWidth,
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2
          size={18}
          className="animate-spin"
        />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}