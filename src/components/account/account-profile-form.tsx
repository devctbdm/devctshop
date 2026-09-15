"use client"

import Link from "next/link"
import * as React from "react"
import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2Icon, LoaderIcon, ShieldCheckIcon } from "lucide-react"

import { CloudinaryImageUpload } from "@/components/cloudinary/cloudinary-image-upload"
import type { CloudinaryAsset } from "@/components/cloudinary/cloudinary-image-preview"
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary/client-folders"
import { FormAlert, SubmitButton, TextField } from "@/components/auth/fields"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authInitialState, type AuthState } from "@/lib/auth/initial-state"
import { logoutAction, updateProfileAction } from "@/lib/auth/actions"
import type { PublicUser } from "@/lib/auth/users"

export function AccountProfileForm({ user, notice }: { user: PublicUser; notice?: { kind: "success"; text: string } | null }) {
  const [profileState, profileAction] = useActionState<AuthState, FormData>(updateProfileAction, authInitialState)
  const [avatar, setAvatar] = useState<CloudinaryAsset | null>(user.avatarUrl ? { publicId: user.avatarPublicId ?? user.avatarUrl, secureUrl: user.avatarUrl, width: user.avatarWidth ?? 256, height: user.avatarHeight ?? 256, format: user.avatarFormat ?? "" } : null)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const router = useRouter()

  async function resendVerification() {
    setResending(true)
    setResent(false)
    try { const response = await fetch("/auth/resend-verification", { method: "POST" }); if (response.ok) setResent(true) } finally { setResending(false) }
  }

  async function logout() { await logoutAction(); router.push("/"); router.refresh() }

  return <div className="space-y-6">{notice ? <FormAlert variant="success">{notice.text}</FormAlert> : null}<Card><CardHeader><CardTitle>Profile</CardTitle><CardDescription>Manage your profile information and avatar.</CardDescription></CardHeader><form action={profileAction}><CardContent className="space-y-5"><div className="flex flex-col gap-2"><span className="text-sm font-medium">Avatar</span><CloudinaryImageUpload value={avatar} onChange={setAvatar} folder={`${CLOUDINARY_FOLDERS.users}/${user.id}`} label="Upload avatar" /><input type="hidden" name="avatarUrl" value={avatar?.secureUrl ?? ""} /><input type="hidden" name="avatarPublicId" value={avatar?.publicId ?? ""} /><input type="hidden" name="avatarWidth" value={avatar?.width ?? ""} /><input type="hidden" name="avatarHeight" value={avatar?.height ?? ""} /><input type="hidden" name="avatarFormat" value={avatar?.format ?? ""} /></div><TextField name="fullName" label="Name" defaultValue={user.fullName} autoComplete="name" error={profileState.fields?.fullName} /><div className="flex justify-end"><SubmitButton>Save profile</SubmitButton></div>{profileState.error && !profileState.fields ? <FormAlert variant="error">Unable to update your profile.</FormAlert> : null}{profileState.ok ? <FormAlert variant="success">Profile updated successfully.</FormAlert> : null}</CardContent></form></Card><Card><CardHeader><CardTitle>Email address</CardTitle><CardDescription>Your email is used for account access and important service messages.</CardDescription></CardHeader><CardContent><div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{user.email}</p>{user.isEmailVerified ? <Badge variant="secondary" className="mt-2 gap-1"><ShieldCheckIcon className="size-3" />Verified</Badge> : <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">Not verified</p>}</div>{user.isEmailVerified ? <CheckCircle2Icon className="size-5 text-emerald-600 dark:text-emerald-400" /> : <Button type="button" variant="outline" size="sm" onClick={resendVerification} disabled={resending}>{resending ? <LoaderIcon className="size-4 animate-spin" /> : null}{resent ? "Verification email sent" : "Resend verification"}</Button>}</div></CardContent></Card><Card><CardHeader><CardTitle>Current session</CardTitle><CardDescription>This is the session currently signed in to this browser.</CardDescription></CardHeader><CardContent><div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/20 p-4"><div><p className="font-medium">Current browser session</p><p className="mt-1 text-sm text-muted-foreground">Active now</p></div><Badge variant="secondary">Current</Badge></div></CardContent></Card><Card><CardHeader><CardTitle>Account</CardTitle><CardDescription>Manage your current account session.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">Need password, appearance, or notification settings?</p><div className="flex gap-2"><Button nativeButton={false} variant="outline" render={<Link href="/account/settings" />}>Settings</Button><Button variant="outline" onClick={logout}>Sign out</Button></div></CardContent></Card></div>
}
