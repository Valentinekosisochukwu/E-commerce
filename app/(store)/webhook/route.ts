import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(request: Request) {
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ??
    process.env.SANITY_DATASET ?? "production";
  if (!dataset) {
    // handle missing value gracefully, or return a 400/500 with a helpful message 
    return new Response ("Missing Sanity dataset configuration", { status: 500
                                                                 });
  }
  console.log("🔔 Webhook endpoint called!");

  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  console.log("Webhook received with signature:", !!sig);

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("❌ Missing signature or webhook secret");
    return NextResponse.json(
      { error: "Webhook configuration error" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log("✅ Stripe event verified:", event.type);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed:`, err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    console.log("💰 Processing completed checkout session");
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await createOrderInSanity(session);
      console.log("✅ Order created successfully in Sanity");
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Failed to create order in Sanity:", error.message);
        if (error.stack) {
          console.error("Stack trace:", error.stack);
        }
        if ((error as any).response) {
          console.error("Sanity response:", (error as any).response);
        }
      } else {
        console.error("❌ Failed to create order in Sanity:", error);
      }
      return NextResponse.json(
        { error: "Failed to create order", details: error },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  console.log("🔍 Session metadata:", session.metadata);

  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  if (!metadata) {
    throw new Error("No metadata found in session");
  }

  const { orderNumber, customerName, customerEmail, clerkUserId } = metadata;

  // Validate required fields
  if (!orderNumber || !customerName || !customerEmail || !clerkUserId) {
    throw new Error(`Missing required metadata: ${JSON.stringify(metadata)}`);
  }

  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(id, {
      expand: ["data.price.product"],
    });

    console.log("🛒 Processing line items:", lineItems.data.length);

    const sanityProducts = [];
    for (const item of lineItems.data) {
      const product = item.price?.product as Stripe.Product;
      const productRef = product?.metadata?.id;

      if (productRef && item.quantity) {
        sanityProducts.push({
          _key: crypto.randomUUID(),
          product: {
            _type: "reference",
            _ref: productRef,
          },
          quantity: item.quantity,
        });
      }
    }

    const orderData = {
      _type: "order",
      orderNumber,
      customerName,
      customerEmail,
      clerkUserId,
      stripeCheckoutSessionId: id,
      stripePaymentIntentId: payment_intent as string,
      stripeCustomerId: customer as string,
      currency: currency || "usd",
      amountDiscount: total_details?.amount_discount
        ? total_details.amount_discount / 100
        : 0,
      totalPrice: amount_total ? amount_total / 100 : 0,
      products: sanityProducts,
      status: "paid" as const,
      orderDate: new Date().toISOString(),
    };

    console.log("💾 Creating order in Sanity:", orderData);

    const result = await backendClient.create(orderData);
    console.log("✅ Order created with ID:", result._id);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error creating order:", error.message);
      if (error.stack) {
        console.error("Stack trace:", error.stack);
      }
      if ((error as any).response) {
        console.error("Sanity response:", (error as any).response);
      }
    } else {
      console.error("❌ Error creating order:", error);
    }
    throw error;
  }
}
