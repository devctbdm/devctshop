export type FieldErrors = Record<string, string[]>

export type AuthState = {
  ok: boolean
  error?: string
  fields?: FieldErrors
}

export const authInitialState: AuthState = { ok: true }
