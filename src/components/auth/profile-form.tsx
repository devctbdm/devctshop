"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import {
  FormAlert,
  PasswordField,
  SubmitButton,
  TextField,
} from "@/components/auth/fields";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderIcon, ShieldCheckIcon } from "lucide-react";
import {
  logoutAction,
  updatePasswordAction,
  updateProfileAction,
} from "@/lib/auth/actions";
import { authInitialState, type AuthState } from "@/lib/auth/initial-state";
import type { PublicUser } from "@/lib/auth/users";

function unauthorizedMessage(state: AuthState) {
  return state.error === "unauthorized"
    ? "You're no longer signed in. Please sign in again."
    : "We couldn't save your changes. Please try again.";
}

export function ProfileForm({
  user,
  notice,
}: {
  user: PublicUser;
  notice?: { kind: "success"; text: string } | null;
}) {
  const [profileState, profileAction] = useActionState<AuthState, FormData>(
    updateProfileAction,
    authInitialState,
  );
  const [passwordState, passwordAction] = useActionState<AuthState, FormData>(
    updatePasswordAction,
    authInitialState,
  );
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const router = useRouter();

  const handleResend = async () => {
    setResending(true);
    setResent(false);
    try {
      await fetch("/auth/resend-verification", { method: "POST" });
      setResent(true);
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      {notice ? (
        <FormAlert variant={notice.kind}>{notice.text}</FormAlert>
      ) : null}

      <Card>
        <form action={profileAction}>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your name and public details.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <TextField
              name="fullName"
              label="Full name"
              defaultValue={user.fullName}
              autoComplete="name"
              error={profileState.fields?.fullName}
            />
            <TextField
              name="avatarUrl"
              label="Avatar URL"
              placeholder="https://…/me.png"
              defaultValue={user.avatarUrl ?? ""}
            />
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">Email</span>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
              </div>
              {user.isEmailVerified ? (
                <Badge variant="secondary" className="gap-1">
                  <ShieldCheckIcon className="size-3" />
                  Verified
                </Badge>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? <LoaderIcon className="animate-spin" /> : null}
                  {resent ? "Resent" : "Verify email"}
                </Button>
              )}
            </div>
            {profileState.error && !profileState.fields ? (
              <FormAlert variant="error">
                {unauthorizedMessage(profileState)}
              </FormAlert>
            ) : null}
            {profileState.ok && !profileState.error ? (
              <FormAlert variant="success">Profile updated.</FormAlert>
            ) : null}
            <div className="flex justify-end">
              <SubmitButton>Save profile</SubmitButton>
            </div>
          </CardContent>
        </form>
      </Card>

      <Card>
        <form action={passwordAction}>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Use at least 8 characters.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <PasswordField
              name="currentPassword"
              label="Current password"
              autoComplete="current-password"
              error={passwordState.fields?.currentPassword}
            />
            <PasswordField
              name="newPassword"
              label="New password"
              autoComplete="new-password"
              error={passwordState.fields?.newPassword}
            />
            {passwordState.error && !passwordState.fields ? (
              <FormAlert variant="error">
                {unauthorizedMessage(passwordState)}
              </FormAlert>
            ) : null}
            {passwordState.ok && !passwordState.error ? (
              <FormAlert variant="success">Password updated.</FormAlert>
            ) : null}
            <div className="flex justify-end">
              <SubmitButton>Update password</SubmitButton>
            </div>
          </CardContent>
        </form>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Session</span>
            <span className="text-sm text-muted-foreground">
              Signed in as {user.email}
            </span>
          </div>
          <div className="flex gap-2">
            {user.role === "ADMIN" ? (
              <Button variant="outline" render={<Link href="/admin" />}>
                Admin area
              </Button>
            ) : null}
            <Button variant="outline" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
