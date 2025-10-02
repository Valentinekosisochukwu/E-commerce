import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/actions/createCheckoutSession";

export async function POST(request: Request) {
  const { items, metadata } = await request.json();
  const sessionUrl = await createCheckoutSession(items, metadata);
  return NextResponse.json({ url: sessionUrl });
}
