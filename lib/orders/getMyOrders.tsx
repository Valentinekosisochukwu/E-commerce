// import { sanityFetch } from "@/sanity/lib/live";
// import { defineQuery } from "next-sanity";

import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

// export async function getMyOrders(userId: string) {
//   if (!userId) {
//     throw new Error("User ID is required to fetch orders.");
//   }

//   // Define the query to fetch orders for the given user ID, sorted by orderDate descending
//   const MY_ORDERS_QUERY = defineQuery(`
//   *[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
//     ...,
//     amountDiscount,
//     products[]->{
//       ...,
//       product->{
//         ...
//       }
//     },
//     totalAmount
//   }
// `);


//   try {
//     // Use sanityFetch to send the query with the userId parameter
//     const orders = await sanityFetch({
//       query: MY_ORDERS_QUERY,
//       params: { userId },
//     });

//     // Return the list of orders, or an empty array if none are found
//     return orders.data || [];
//   } catch (error) {
//     console.error("Error fetching my orders:", error);
//     return [];
//   }
// }


export async function getMyOrders(userId: string) {
  console.log('🔍 getMyOrders called with userId:', userId);
  
  if (!userId) {
    console.error('❌ User ID is required to fetch orders.');
    throw new Error("User ID is required to fetch orders.");
  }

  const MY_ORDERS_QUERY = defineQuery(`
    *[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
      orderNumber,
      customerName,
      customerEmail,
      clerkUserId,
      stripeCheckoutSessionId,
      stripePaymentIntentId,
      stripeCustomerId,
      currency,
      amountDiscount,
      totalPrice,
      status,
      orderDate,
      products[]{
        quantity,
        product->{
          _id,
          name,
          price,
          "image": image
        }
      }
    }
  `);

  try {
    console.log('📡 Fetching orders from Sanity...');
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });

    console.log('✅ Sanity response:', {
      data: orders.data,
      hasData: !!orders.data,
      dataLength: orders.data?.length || 0,
      source: orders.sourceMap
    });

    return orders.data || [];
  } catch (error) {
    console.error("❌ Error fetching my orders:", error);
    return [];
  }
}
