export type Currency = "USD" | "BDT"
export const CURRENCIES: Record<Currency, { label: string; symbol: string }> = { USD: { label: "US Dollar", symbol: "$" }, BDT: { label: "Bangladeshi Taka", symbol: "৳" } }

export function isCurrency(value: string | null | undefined): value is Currency { return value === "USD" || value === "BDT" }
export function convertUsdCents(usdCents: number, currency: Currency, rate: number) { return currency === "BDT" ? Math.round(usdCents * rate) : usdCents }
export function formatCurrency(cents: number, currency: Currency) { return new Intl.NumberFormat(currency === "BDT" ? "bn-BD" : "en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(cents / 100) }
