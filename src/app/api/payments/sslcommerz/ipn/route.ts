import { NextResponse } from "next/server";

import { formDataToObject } from "@/lib/sslcommerz";
import {
  markPaymentOutcome,
  processSslcommerzPayment,
} from "@/lib/payment-service";

export async function POST(request: Request) {
  const data = formDataToObject(await request.formData());
  try {
    if (data.status === "VALID") {
      await processSslcommerzPayment(data);
    } else if (
      data.tran_id &&
      ["FAILED", "CANCELLED", "EXPIRED", "UNATTEMPTED"].includes(
        data.status ?? "",
      )
    ) {
      await markPaymentOutcome(
        data.tran_id,
        data.status === "CANCELLED" ? "cancelled" : "failed",
        data,
      );
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("SSLCommerz IPN processing failed", error);
    return NextResponse.json({ received: false }, { status: 422 });
  }
}
