"use client";

import * as React from "react";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronsUpDownIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UserRoundIcon,
} from "lucide-react";

export interface HeaderUser {
  name: string;
  email: string;
  image?: string | null;
  role: "USER" | "ADMIN";
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

export function UserMenu({ user }: { user: HeaderUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={true}
        render={
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="Account menu"
          />
        }
      >
        <Avatar>
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex flex-col gap-0.5 px-1 py-1.5 text-left">
              <span className="truncate text-sm font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem nativeButton={false} render={<a href="/account" />}>
            <UserRoundIcon />
            Profile
          </DropdownMenuItem>
          {user.role === "ADMIN" ? (
            <DropdownMenuItem nativeButton={false} render={<a href="/admin" />}>
              <LayoutDashboardIcon />
              Admin area
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          nativeButton={true}
          render={
            <button
              type="button"
              onClick={() => signOut({ redirectTo: "/" })}
            />
          }
        >
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
