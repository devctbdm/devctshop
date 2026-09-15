"use client"

import Link from "next/link"
import * as React from "react"
import { useTheme } from "next-themes"
import { useActionState } from "react"
import { AlertTriangleIcon, LoaderIcon, LogOutIcon, MoonIcon, MonitorIcon, SunIcon } from "lucide-react"

import { FormAlert, PasswordField, SubmitButton } from "@/components/auth/fields"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { deleteAccountAction, logoutAction, updateNotificationPreferencesAction, updatePasswordAction } from "@/lib/auth/actions"
import { authInitialState, type AuthState } from "@/lib/auth/initial-state"

type Preferences = { orderNotifications: boolean; downloadNotifications: boolean; productUpdates: boolean; emailNotifications: boolean }

export function AccountSettingsForm({ preferences }: { preferences: Preferences }) {
  const [passwordState, passwordAction] = useActionState<AuthState, FormData>(updatePasswordAction, authInitialState)
  const [notice, setNotice] = React.useState<string | null>(null)
  const [preferenceError, setPreferenceError] = React.useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const { theme, setTheme } = useTheme()

  async function savePreferences(formData: FormData) {
    setNotice(null)
    setPreferenceError(null)
    try {
      const result = await updateNotificationPreferencesAction(formData)
      if (result.ok) setNotice("Notification preferences saved.")
      else setPreferenceError("Unable to save notification preferences.")
    } catch {
      setPreferenceError("Unable to save notification preferences.")
    }
  }

  async function logout() {
    await logoutAction()
  }

  async function deleteAccount() {
    setDeleting(true)
    await deleteAccountAction()
  }

  return <div className="space-y-6"><Card><CardHeader><CardTitle>Security</CardTitle><CardDescription>Change your password using your existing account credentials.</CardDescription></CardHeader><form action={passwordAction}><CardContent className="space-y-4"><PasswordField name="currentPassword" label="Current password" autoComplete="current-password" error={passwordState.fields?.currentPassword} /><PasswordField name="newPassword" label="New password" autoComplete="new-password" error={passwordState.fields?.newPassword} /><PasswordField name="confirmPassword" label="Confirm new password" autoComplete="new-password" error={passwordState.fields?.confirmPassword} />{passwordState.error && !passwordState.fields ? <FormAlert variant="error">Unable to change password. Please check your current password.</FormAlert> : null}{passwordState.ok ? <FormAlert variant="success">Password changed successfully.</FormAlert> : null}<SubmitButton>Change Password</SubmitButton></CardContent></form></Card><Card><CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Choose how Devct Shop looks for you.</CardDescription></CardHeader><CardContent><div className="grid gap-2 sm:grid-cols-3">{([{ value: "system", label: "System", icon: MonitorIcon }, { value: "light", label: "Light", icon: SunIcon }, { value: "dark", label: "Dark", icon: MoonIcon }] as const).map((option) => { const Icon = option.icon; const selected = theme === option.value; return <button key={option.value} type="button" onClick={() => setTheme(option.value)} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${selected ? "border-primary bg-primary/10 text-foreground" : "hover:bg-muted"}`} aria-pressed={selected}><Icon className="size-4" />{option.label}</button> })}</div></CardContent></Card><Card><CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Choose which updates you want to receive.</CardDescription></CardHeader><form action={savePreferences}><CardContent className="space-y-4">{[{ name: "orderNotifications", title: "Order notifications", description: "Receive updates about your orders.", checked: preferences.orderNotifications }, { name: "downloadNotifications", title: "Download notifications", description: "Receive notifications about your digital downloads.", checked: preferences.downloadNotifications }, { name: "productUpdates", title: "Product updates", description: "Receive updates about products you purchased.", checked: preferences.productUpdates }, { name: "emailNotifications", title: "Email notifications", description: "Receive important account and service emails.", checked: preferences.emailNotifications }].map((item) => <label key={item.name} className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/40"><span><span className="block text-sm font-medium">{item.title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span></span><input type="checkbox" name={item.name} defaultChecked={item.checked} className="size-4 accent-primary" /></label>)}{preferenceError ? <FormAlert variant="error">{preferenceError}</FormAlert> : null}{notice ? <FormAlert variant="success">{notice}</FormAlert> : null}<Button type="submit" disabled={false}>Save notification preferences</Button></CardContent></form></Card><Card className="border-destructive/30"><CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangleIcon className="size-4" />Account actions</CardTitle><CardDescription>Sign out or permanently remove your personal account access.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium">Sign out</p><p className="text-xs text-muted-foreground">End your current session on this device.</p></div><Button variant="outline" onClick={logout}><LogOutIcon className="size-4" />Sign out</Button></div><Separator /><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium">Delete account</p><p className="text-xs text-muted-foreground">Your account access is removed while order records are preserved.</p></div><Dialog open={deleteOpen} onOpenChange={setDeleteOpen}><DialogTrigger render={<Button variant="destructive" />}>Delete Account</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Delete account?</DialogTitle><DialogDescription>This action cannot be undone. Your account access and personal profile will be removed. Order, payment, and download records are retained for marketplace records.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={deleteAccount} disabled={deleting}>{deleting ? <LoaderIcon className="size-4 animate-spin" /> : null}{deleting ? "Deleting…" : "Delete Account"}</Button></DialogFooter></DialogContent></Dialog></div></CardContent></Card><p className="text-sm text-muted-foreground">Need to update your name, avatar, or email verification? Visit <Link href="/account" className="font-medium text-foreground underline underline-offset-4">Profile</Link>.</p></div>
}
