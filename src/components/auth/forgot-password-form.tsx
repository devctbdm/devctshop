"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { FormAlert, SubmitButton, TextField } from "@/components/auth/fields";
import { forgotPasswordAction } from "@/lib/auth/actions";
import { authInitialState, type AuthState } from "@/lib/auth/initial-state";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export function ForgotPasswordForm({ sent = false }: { sent?: boolean }) {
  const [state, formAction] = useActionState<AuthState, FormData>(
    forgotPasswordAction,
    authInitialState,
  );

  return (
    <AuthCard
      title="Reset your password"
      description="Enter the email associated with your account and we'll send you a link to reset your password."
      footer={
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:underline"
        >
          <ArrowLeftIcon className="size-4" />
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col gap-4">
          <FormAlert variant="success">
            If an account exists for that email, you&apos;ll receive a password
            reset link shortly. Check your inbox (and spam folder).
          </FormAlert>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            render={<Link href="/auth/login" />}
          >
            Return to sign in
          </Button>
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-4">
          <TextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={state.fields?.email}
          />
          <SubmitButton>Email me a reset link</SubmitButton>
        </form>
      )}
    </AuthCard>
  );
}
