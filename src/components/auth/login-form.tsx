"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthDivider } from "@/components/auth/divider";
import {
  FormAlert,
  PasswordField,
  SubmitButton,
  TextField,
} from "@/components/auth/fields";
import { GoogleButton } from "@/components/auth/google-button";
import { loginAction } from "@/lib/auth/actions";
import { authInitialState, type AuthState } from "@/lib/auth/initial-state";

interface Notice {
  kind: "success" | "error" | "info";
  text: string;
}

const errorMessage: Record<string, string> = {
  invalid_credentials: "Incorrect email or password.",
  auth_error: "Unable to sign in right now. Please try again.",
  register_failed: "Something went wrong. Please try again.",
};

export function LoginForm({
  callbackUrl,
  notice,
}: {
  callbackUrl?: string;
  notice?: Notice | null;
}) {
  const [state, formAction] = useActionState<AuthState, FormData>(
    loginAction,
    authInitialState,
  );

  const alert =
    state.error && !state.fields ? errorMessage[state.error] : undefined;

  return (
    <AuthCard
      title="Sign in to your account"
      description="Welcome back. Enter your details to continue."
      footer={
        <>
          New to Devct Shop?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-foreground transition-colors hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {notice ? (
          <FormAlert variant={notice.kind}>{notice.text}</FormAlert>
        ) : null}
        {alert ? <FormAlert variant="error">{alert}</FormAlert> : null}

        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
          <TextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={state.fields?.email}
          />
          <PasswordField
            name="password"
            label="Password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={state.fields?.password}
          />
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <SubmitButton>Sign in</SubmitButton>
        </form>

        <AuthDivider />

        <GoogleButton redirectTo={callbackUrl ?? "/"} />
      </div>
    </AuthCard>
  );
}
