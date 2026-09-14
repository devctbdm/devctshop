import { handleOutcome } from "@/lib/sslcommerz-callback"

export async function POST(request: Request) {
  return handleOutcome(request, "cancelled")
}

export async function GET(request: Request) {
  return handleOutcome(request, "cancelled")
}
