// Run this script with: node scripts/updateStripeProductMetadata.js
// Make sure you have STRIPE_SECRET_KEY and SANITY_API_TOKEN in your environment

import Stripe from "stripe";
import fetch from "node-fetch";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15" as any, // or remove the type assertion
});
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID!;
const SANITY_DATASET = process.env.SANITY_DATASET!;
const SANITY_TOKEN = process.env.SANITY_API_TOKEN!;

async function getSanityProducts() {
  const query = '*[_type == "product"]{_id, name}';
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${SANITY_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Sanity API error: ${res.statusText}`);
  }

  const json = (await res.json()) as { result: any[] };
  return json.result;
}

async function updateStripeProducts() {
  const sanityProducts = await getSanityProducts();
  for (const sanityProduct of sanityProducts) {
    // Find Stripe product by name (or other logic)
    const stripeProducts = await stripe.products.list({
      active: true,
      limit: 100,
    });
    const match = stripeProducts.data.find(
      (p) => p.name === sanityProduct.name
    );
    if (!match) {
      console.log(
        `No Stripe product found for Sanity product: ${sanityProduct.name}`
      );
      continue;
    }
    // Update Stripe product metadata
    await stripe.products.update(match.id, {
      metadata: { ...match.metadata, id: sanityProduct._id },
    });
    console.log(
      `Updated Stripe product '${match.name}' with Sanity ID '${sanityProduct._id}'`
    );
  }
}

updateStripeProducts().catch(console.error);
