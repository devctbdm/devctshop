"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import {
  FormAlert,
  PasswordField,
  SubmitButton,
} from "@/components/auth/fields";
import { resetPasswordAction } from "@/lib/auth/actions";
import { authInitialState, type AuthState } from "@/lib/auth/initial-state";

export function ResetPasswordForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const [state, formAction] = useActionState<AuthState, FormData>(
    resetPasswordAction,
    authInitialState,
  );

  const invalidToken = Boolean(state.fields?.token?.length);

  return (
    <AuthCard
      title="Choose a new password"
      description="Enter a new password for your Devct Shop account."
      footer={
        <Link
          href="/auth/login"
          className="font-medium text-foreground transition-colors hover:underline"
        >
          Back to sign in
        </Link>
      }
    >
      {invalidToken ? (
        <div className="flex flex-col gap-4">
          <FormAlert variant="error">
            This reset link is invalid or has expired. Please request a new one.
          </FormAlert>
          <FormAlert variant="info">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-foreground hover:underline"
            >
              Request a new reset link
            </Link>
          </FormAlert>
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="email" value={email} />
          <PasswordField
            name="password"
            label="New password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={state.fields?.password}
          />
          <SubmitButton>Update password</SubmitButton>
        </form>
      )}
    </AuthCard>
  );
}
