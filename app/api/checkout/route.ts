//import { NextResponse } from "next/server";
//import { createCheckoutSession } from "@/actions/createCheckoutSession";

//export async function POST(request: Request) {
 // const { items, metadata } = await request.json();
 // const sessionUrl = await createCheckoutSession(items, metadata);
//  return NextResponse.json({ url: sessionUrl });
//}

import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { imageUrl } from "@/lib/imageUrl";

export async function POST(request: Request) {
  try {
    const { items, metadata } = await request.json();

    // Check missing price
    const itemsWithoutPrice = items.filter((item: any) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      return NextResponse.json(
        { error: "Some items do not have a price." },
        { status: 400 }
      );
    }

    // Find or create customer
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
    const cancelUrl = `${baseUrl}/basket`;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata,
      allow_promotion_codes: true,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.product.price * 100),
          product_data: {
            name: item.product.name ?? "Unknown Product",
            description: `Product ID: ${item.product._id}`,
            metadata: { id: item.product._id },
            images: item.product.image
              ? [imageUrl(item.product.image).url()]
              : undefined,
          },
        },
        quantity: item.quantity,
      })),
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("CHECKOUT ERROR", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
