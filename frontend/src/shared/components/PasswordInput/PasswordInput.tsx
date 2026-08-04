import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import Input from "../Input";

import type { PasswordInputProps } from "./PasswordInput.types";

export default function PasswordInput(
  props: PasswordInputProps,
) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((previous) => !previous);
  };

  return (
    <Input
      {...props}
      type={showPassword ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          onClick={togglePassword}
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          aria-pressed={showPassword}
          className="
            flex
            items-center
            justify-center
            rounded
            text-gray-500
            transition-colors
            hover:text-gray-700
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:ring-offset-1
          "
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      }
    />
  );
}