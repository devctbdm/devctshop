import { handleOutcome } from "@/lib/sslcommerz-callback"

export async function POST(request: Request) {
  return handleOutcome(request, "failed")
}

export async function GET(request: Request) {
  return handleOutcome(request, "failed")
}
