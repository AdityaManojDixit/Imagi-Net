import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const secret = process.env.RAZORPAY_KEY_SECRET!;

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(body));
    const digest = shasum.digest("hex");

    if (digest === req.headers.get("x-razorpay-signature")) {
      console.log("Webhook verified:", body);
      return NextResponse.json({ status: "ok" });
    } else {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
