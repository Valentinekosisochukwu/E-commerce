// import Stripe from "stripe";

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("Missing Stripe secret key in environment variables");
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2022-11-15" as any,
// });
// export default stripe;



// import Stripe from "stripe";

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-07-30.basil",
// });

// // Example: creating a checkout session
// export async function createCheckoutSession(
//   params: Stripe.Checkout.SessionCreateParams
// ): Promise<Stripe.Checkout.Session> {
//   return await stripe.checkout.sessions.create(params);
// }


import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default stripe; // ✅ default export
