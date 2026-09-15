import "server-only"

type GatewayPayload = Record<string, string>

type InitResponse = {
  status?: string
  failedreason?: string
  GatewayPageURL?: string
  sessionkey?: string
}

type ValidationResponse = GatewayPayload & {
  status?: string
  tran_id?: string
  val_id?: string
  amount?: string
  currency?: string
  currency_amount?: string
  currency_type?: string
}

function required(name: string) {
  const value = process.env[name]
  if (!value?.trim()) throw new Error(`sslcommerz_missing_${name.toLowerCase()}`)
  return value
}

export function sslBaseUrl() {
  return process.env.SSLCOMMERZ_IS_LIVE === "true"
    ? "https://securepay.sslcommerz.com"
    : "https://sandbox.sslcommerz.com"
}

export function publicOrigin() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
}

export function hasPublicCallbackOrigin() {
  try {
    const url = new URL(publicOrigin())
    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(url.hostname)
    const allowLocalhost =
      process.env.NODE_ENV === "development" &&
      process.env.SSLCOMMERZ_ALLOW_LOCALHOST === "true"

    return !isLocalhost || allowLocalhost
  } catch {
    return false
  }
}

export async function initializeSslcommerzPayment({
  orderNumber,
  amountCents,
  email,
  name,
  productNames,
  currency = "USD",
}: {
  orderNumber: string
  amountCents: number
  email: string
  name: string
  productNames: string[]
  currency?: "USD" | "BDT"
}) {
  if (!hasPublicCallbackOrigin()) throw new Error("sslcommerz_public_callback_url_required")

  const form = new URLSearchParams({
    store_id: required("SSLCOMMERZ_STORE_ID"),
    store_passwd: required("SSLCOMMERZ_STORE_PASSWORD"),
    total_amount: (amountCents / 100).toFixed(2),
    currency,
    tran_id: orderNumber,
    success_url: `${publicOrigin()}/api/payments/sslcommerz/success`,
    fail_url: `${publicOrigin()}/api/payments/sslcommerz/fail`,
    cancel_url: `${publicOrigin()}/api/payments/sslcommerz/cancel`,
    ipn_url: `${publicOrigin()}/api/payments/sslcommerz/ipn`,
    product_category: "digital-products",
    product_name: productNames.join(", ").slice(0, 255),
    product_profile: "non-physical-goods",
    cus_name: name.slice(0, 50),
    cus_email: email.slice(0, 50),
    cus_add1: "Digital delivery",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: "01700000000",
    shipping_method: "NO",
    num_of_item: String(productNames.length),
    value_a: orderNumber,
  })

  const response = await fetch(`${sslBaseUrl()}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form,
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`sslcommerz_http_${response.status}`)

  let result: InitResponse
  try {
    result = (await response.json()) as InitResponse
  } catch {
    throw new Error("sslcommerz_invalid_response")
  }
  if (result.status !== "SUCCESS" || !result.GatewayPageURL) {
    throw new Error(
      result.failedreason
        ? `sslcommerz_${result.failedreason.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`
        : "sslcommerz_no_payment_url",
    )
  }
  return result
}

export async function validateSslcommerzPayment(valId: string) {
  const url = new URL(`${sslBaseUrl()}/validator/api/validationserverAPI.php`)
  url.searchParams.set("val_id", valId)
  url.searchParams.set("store_id", required("SSLCOMMERZ_STORE_ID"))
  url.searchParams.set("store_passwd", required("SSLCOMMERZ_STORE_PASSWORD"))
  url.searchParams.set("format", "json")

  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) throw new Error(`SSLCommerz validation failed (${response.status})`)
  return (await response.json()) as ValidationResponse
}

export function formDataToObject(formData: FormData): GatewayPayload {
  return Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [key, typeof value === "string" ? value : value.name]),
  )
}
