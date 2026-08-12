import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import PasswordInput from "@/shared/components/PasswordInput";

import { loginUser } from "../api/auth.api";
import { createSession } from "../services/authSession";
import useAuth from "../hooks/useAuth";

import {
  loginSchema,
  type LoginFormData,
} from "../validation/login.schema";

export default function LoginForm() {
  const navigate = useNavigate();

  const { establishSession } = useAuth();

  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: LoginFormData,
  ) => {
    setAuthError(null);

    try {
      const session = await loginUser(data);

      const user = createSession(session);
      
      establishSession(user);

      navigate(
        user.role === "ADMIN"
          ? "/admin/dashboard"
          : "/teacher/dashboard",
        {
          replace: true,
        },
      );
    } catch {
      setAuthError(
        "Invalid username or password."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      {authError && (
        <div
          role="alert"
          className="
            rounded-lg
            border
            border-red-200
            bg-red-50
            p-3
            text-sm
            text-red-700
          "
        >
          {authError}
        </div>
      )}

      <Input
        label="Username"
        autoFocus
        disabled={isSubmitting}
        autoComplete="username"
        error={errors.username?.message}
        {...register("username")}
      />

      <PasswordInput
        label="Password"
        disabled={isSubmitting}
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting
          ? "Signing In..."
          : "Sign In"}
      </Button>
    </form>
  );
}