"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react"

interface FieldProps {
  name: string
  label: string
  type?: string
  value?: string
  defaultValue?: string
  autoComplete?: string
  placeholder?: string
  error?: string[]
  disabled?: boolean
}

export function TextField({
  name,
  label,
  type = "text",
  value,
  defaultValue,
  autoComplete,
  placeholder,
  error,
  disabled,
}: FieldProps) {
  const invalid = Boolean(error && error.length)
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid}
        className={cn(invalid && "border-destructive focus-visible:ring-destructive/20")}
      />
      {invalid ? (
        <p className="text-xs text-destructive">{error?.[0]}</p>
      ) : null}
    </div>
  )
}

export function PasswordField(props: FieldProps) {
  const [show, setShow] = React.useState(false)
  const invalid = Boolean(props.error && props.error.length)
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={props.name}>{props.label}</Label>
      <div className="relative">
        <Input
          id={props.name}
          name={props.name}
          type={show ? "text" : "password"}
          value={props.value}
          defaultValue={props.defaultValue}
          autoComplete={props.autoComplete}
          placeholder={props.placeholder}
          disabled={props.disabled}
          aria-invalid={invalid}
          className={cn(
            "pr-10",
            invalid && "border-destructive focus-visible:ring-destructive/20"
          )}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      </div>
      {invalid ? (
        <p className="text-xs text-destructive">{props.error?.[0]}</p>
      ) : null}
    </div>
  )
}

export function FormAlert({
  variant,
  children,
}: {
  variant: "success" | "error" | "info"
  children: React.ReactNode
}) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm",
        variant === "success" &&
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        variant === "error" &&
          "border-destructive/30 bg-destructive/10 text-destructive",
        variant === "info" && "border-border bg-muted/50 text-muted-foreground"
      )}
    >
      {children}
    </div>
  )
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <LoaderIcon className="animate-spin" />
          <span className="sr-only">Processing…</span>
        </>
      ) : (
        children
      )}
    </Button>
  )
}
