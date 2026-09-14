import { handleSuccess } from "@/lib/sslcommerz-callback"

export async function POST(request: Request) {
  return handleSuccess(request)
}

export async function GET(request: Request) {
  return handleSuccess(request)
}
