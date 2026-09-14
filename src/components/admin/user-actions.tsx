"use client"

import { updateUserRoleAction, updateUserStatusAction } from "@/lib/admin-actions"
import { Button } from "@/components/ui/button"

export function UserActions({ id, active, role }: { id: string; active: boolean; role: "USER" | "ADMIN" }) {
  return <div className="flex justify-end gap-2"><form action={updateUserStatusAction}><input type="hidden" name="id" value={id} /><input type="hidden" name="value" value={String(!active)} /><Button size="sm" variant={active ? "outline" : "secondary"} type="submit">{active ? "Disable" : "Enable"}</Button></form><form action={updateUserRoleAction}><input type="hidden" name="id" value={id} /><input type="hidden" name="role" value={role === "ADMIN" ? "USER" : "ADMIN"} /><Button size="sm" variant="ghost" type="submit">{role === "ADMIN" ? "Make user" : "Make admin"}</Button></form></div>
}
