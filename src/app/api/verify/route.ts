import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return NextResponse.json({ message: "Payment Verified Successfully" });
    } else {
      return NextResponse.json({ message: "Payment Verification Failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification Error" }, { status: 500 });
  }
}
