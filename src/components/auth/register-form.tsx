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
import { registerAction } from "@/lib/auth/actions";
import { authInitialState, type AuthState } from "@/lib/auth/initial-state";

export function RegisterForm({ sent = false }: { sent?: boolean }) {
  const [state, formAction] = useActionState<AuthState, FormData>(
    registerAction,
    authInitialState,
  );

  return (
    <AuthCard
      title="Create your account"
      description="Start shipping faster. Set up your Devct Shop account."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-foreground transition-colors hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {sent ? (
          <FormAlert variant="success">
            Your account was created. Check your email to verify your address,
            then sign in.
          </FormAlert>
        ) : null}

        <form action={formAction} className="flex flex-col gap-4">
          <TextField
            name="fullName"
            label="Full name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            error={state.fields?.fullName}
          />
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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={state.fields?.password}
          />
          <SubmitButton>Create account</SubmitButton>
        </form>

        <AuthDivider />

        <GoogleButton redirectTo="/account" />
      </div>
    </AuthCard>
  );
}
