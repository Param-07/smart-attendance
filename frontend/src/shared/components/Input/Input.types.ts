// Input.types.ts

import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;

  helperText?: string;

  error?: string;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;
}