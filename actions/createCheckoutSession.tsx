"use server";


import { BasketItem } from "@/app/(store)/store";
import { imageUrl } from "@/lib/imageUrl";
import stripe from "@/lib/stripe";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export type GroupBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export async function createCheckoutSession(
  items: GroupBasketItem[],
  metadata: Metadata
): Promise<any> {
  try {
    // check if any group items don't have a price
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Some items do not have a price.");
    }

    // Search for existing customer by email
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `https://${process.env.VERCEL_URL}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}`;

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;

    const cancelUrl = `${baseUrl}/basket`;

    console.log("Base URL:", baseUrl);
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata,
      allow_promotion_codes: true,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${baseUrl}/basket`,
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.product.price! * 100), // Stripe expects amount in cents
          product_data: {
            name: item.product.name || "Unknown Product",
            description: `Product ID: ${item.product._id}`,
            metadata: {
              id: item.product._id,
            },
            images: item.product.image
              ? [imageUrl(item.product.image).url()]
              : undefined,
          },
        },
        quantity: item.quantity,
      })),
    });

    console.log("Creating checkout session with:", items, metadata);
    return session.url;
  } catch (error) {
    console.error("Error creating checkout session", error);
    throw error;
  }
}

// actions/createCheckoutSession.ts
// 'use server';

// import stripe from "@/lib/stripe";

// export async function createCheckoutSession(  cartItems: any[], 
//   userId: string, 
//   userInfo?: { 
//     customerName: string; 
//     customerEmail: string; 
//   })

// {
//   try {
//     // Generate order number
//     const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: cartItems.map(item => ({
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: item.product.name,
//             images: [item.product.image?.url],
//             metadata: {
//               id: item.product._id, // Make sure this matches your Sanity product ID
//             },
//           },
//           unit_amount: Math.round(item.product.price * 100), // Convert to cents
//         },
//         quantity: item.quantity,
//       })),
//       mode: 'payment',
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
//       metadata: {
//         orderNumber,
//         customerName: userInfo?.customerName || 'Customer Name',
//         customerEmail: userInfo?.customerEmail || 'customer@example.com',
//         clerkUserId: userId,
//       },
//       client_reference_id: userId, // Also set this for backup
//     });

//     console.log('🎯 Checkout session created with metadata:', session.metadata);
//     return session;

//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     throw error;
//   }
// }