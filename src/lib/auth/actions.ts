"use server";

import { and, eq, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AuthError, CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { passwordResetTokens, users } from "@/db/schema";
import { emailEnabled } from "@/lib/email/sender";
import {
  createCustomer,
  findUserByEmail,
  findUserById,
} from "@/lib/auth/users";
import {
  issuePasswordResetEmail,
  issueVerificationEmail,
} from "@/lib/auth/tokens";
import { auth, signIn, signOut } from "@/lib/auth/auth";
import type { AuthState, FieldErrors } from "./initial-state";

const BCRYPT_ROUNDS = 10;

function isRelativeUrl(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//");
}

async function loginAction(
  prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  void prev;
  const raw = (formData.get("callbackUrl") as string | null) ?? "/";
  const callbackUrl = isRelativeUrl(raw) ? raw : "/";
  try {
    await signIn("credentials", formData, { redirectTo: callbackUrl });
    return { ok: true };
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { ok: false, error: "invalid_credentials" };
    }
    if (error instanceof AuthError) {
      return { ok: false, error: "auth_error" };
    }
    // Propagate Next.js redirect errors so the client navigates.
    throw error;
  }
}

async function registerAction(
  prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  void prev;
  const fullName = (formData.get("fullName") as string | null)?.trim() ?? "";
  const email =
    (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  const fields: FieldErrors = {};
  if (fullName.length < 2) fields.fullName = ["Enter your full name."];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fields.email = ["Enter a valid email address."];
  if (password.length < 8)
    fields.password = ["Password must be at least 8 characters."];
  if (Object.keys(fields).length > 0) return { ok: false, fields };

  const existing = await findUserByEmail(email);
  if (existing) {
    return {
      ok: false,
      fields: { email: ["An account with this email already exists."] },
    };
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    const user = await createCustomer({ email, fullName, passwordHash });
    if (emailEnabled()) {
      await issueVerificationEmail(user);
    } else {
      await db
        .update(users)
        .set({ isEmailVerified: true, updatedAt: new Date() })
        .where(eq(users.id, user.id));
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("users_email_unique") || msg.includes("duplicate key")) {
      return {
        ok: false,
        fields: { email: ["An account with this email already exists."] },
      };
    }
    return { ok: false, error: "register_failed" };
  }

  redirect("/auth/register?sent=1");
}

async function forgotPasswordAction(
  prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  void prev;
  const email =
    (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, fields: { email: ["Enter a valid email address."] } };
  }

  const user = await findUserByEmail(email);
  if (user && user.isActive) {
    await issuePasswordResetEmail(user);
  }

  // Always report success to avoid leaking whether an account exists.
  redirect("/auth/forgot-password?sent=1");
}

async function resetPasswordAction(
  prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  void prev;
  const token = (formData.get("token") as string | null) ?? "";
  const email =
    (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  const fields: FieldErrors = {};
  if (!token) fields.token = ["Missing reset token."];
  if (password.length < 8)
    fields.password = ["Password must be at least 8 characters."];
  if (Object.keys(fields).length > 0) return { ok: false, fields };

  const [row] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token, token),
        isNull(passwordResetTokens.usedAt),
      ),
    )
    .limit(1);

  const valid =
    row && row.email.toLowerCase() === email && row.expiresAt > new Date();

  if (!valid) {
    return {
      ok: false,
      error: "invalid_token",
      fields: { token: ["This reset link is invalid or has expired."] },
    };
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const userId = row.userId;

  await db.transaction(async (tx) => {
    await tx
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, row.id));
    await tx
      .update(users)
      .set({ passwordHash, isEmailVerified: true, updatedAt: new Date() })
      .where(eq(users.id, userId));
    await tx
      .delete(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.userId, userId),
          isNull(passwordResetTokens.usedAt),
        ),
      );
  });

  redirect("/auth/login?reset=1");
}

async function updateProfileAction(
  prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  void prev;
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return { ok: false, error: "unauthorized" };

  const user = await findUserById(id);
  if (!user || !user.isActive) return { ok: false, error: "unauthorized" };

  const fullName = (formData.get("fullName") as string | null)?.trim() ?? "";
  const avatarUrl = (formData.get("avatarUrl") as string | null)?.trim() ?? "";
  const avatarPublicId = (formData.get("avatarPublicId") as string | null)?.trim() ?? "";
  const avatarWidth = Number(formData.get("avatarWidth")) || null;
  const avatarHeight = Number(formData.get("avatarHeight")) || null;
  const avatarFormat = (formData.get("avatarFormat") as string | null)?.trim() ?? "";

  const fields: FieldErrors = {};
  if (fullName.length < 2) fields.fullName = ["Enter your full name."];
  if (Object.keys(fields).length > 0) return { ok: false, fields };

  await db
    .update(users)
    .set({
      fullName,
      avatarUrl: avatarUrl || null,
      avatarPublicId: avatarPublicId || null,
      avatarWidth,
      avatarHeight,
      avatarFormat: avatarFormat || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id));

  revalidatePath("/account");
  return { ok: true };
}

async function updatePasswordAction(
  prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  void prev;
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return { ok: false, error: "unauthorized" };

  const user = await findUserById(id);
  if (!user || !user.isActive) return { ok: false, error: "unauthorized" };

  const currentPassword =
    (formData.get("currentPassword") as string | null) ?? "";
  const newPassword = (formData.get("newPassword") as string | null) ?? "";

  const fields: FieldErrors = {};
  if (!currentPassword)
    fields.currentPassword = ["Enter your current password."];
  if (newPassword.length < 8)
    fields.newPassword = ["Password must be at least 8 characters."];
  if (Object.keys(fields).length > 0) return { ok: false, fields };

  const valid = user.passwordHash
    ? await bcrypt.compare(currentPassword, user.passwordHash)
    : false;
  if (!valid) {
    return {
      ok: false,
      fields: { currentPassword: ["Current password is incorrect."] },
    };
  }

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, id));

  revalidatePath("/account");
  return { ok: true };
}

async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

export {
  loginAction,
  registerAction,
  forgotPasswordAction,
  resetPasswordAction,
  updateProfileAction,
  updatePasswordAction,
  logoutAction,
};
