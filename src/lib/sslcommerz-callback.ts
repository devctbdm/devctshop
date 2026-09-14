import { redirect } from "next/navigation"

import { formDataToObject } from "@/lib/sslcommerz"
import { markPaymentOutcome, processSslcommerzPayment } from "@/lib/payment-service"

export async function callbackPayload(request: Request) {
  if (request.method === "GET") {
    return Object.fromEntries(new URL(request.url).searchParams.entries())
  }
  return formDataToObject(await request.formData())
}

export async function handleSuccess(request: Request) {
  const data = await callbackPayload(request)
  const orderNumber = data.tran_id
  try {
    if (!orderNumber) throw new Error("missing_transaction_id")
    await processSslcommerzPayment(data)
  } catch {
    redirect(`/payment/fail?order=${encodeURIComponent(orderNumber ?? "")}`)
  }
  redirect(`/payment/success?order=${encodeURIComponent(orderNumber)}`)
}

export async function handleOutcome(request: Request, status: "failed" | "cancelled") {
  const data = await callbackPayload(request)
  const orderNumber = data.tran_id
  if (orderNumber) await markPaymentOutcome(orderNumber, status, data)
  redirect(`/${status === "cancelled" ? "payment/cancel" : "payment/fail"}?order=${encodeURIComponent(orderNumber ?? "")}`)
}
