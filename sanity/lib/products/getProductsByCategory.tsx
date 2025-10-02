// import { defineQuery } from "next-sanity";
// import { sanityFetch } from "../live";

// export const getProductsByCategory = async (categorySlug: string) => {
//   const PRODUCT_BY_CATEGORY_QUERY = defineQuery(`
//     *[_type == "product" && references(*[_type == "category" slug.current == $categorySlug]._id)] | order(name asc)
//   `);

//   try {
//         // Use sanityfetch to send the query and pass the category slug
//     const products} = await sanityFetch({
//       query: PRODUCT_BY_CATEGORY_QUERY,
//       params: { categorySlug },
//     });

//         // Return the list of products, an empty array if not found
//     return products.data || [];
//   } catch (error) {
//     console.error(`Error fetching product with slug "${slug}":`, error);
//     return null;
//   }

import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByCategory = async (categorySlug: string) => {
  const PRODUCT_BY_CATEGORY_QUERY = defineQuery(`
    *[_type == "product" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc)
  `);

  try {
    const { data: products } = await sanityFetch({
      query: PRODUCT_BY_CATEGORY_QUERY,
      params: { categorySlug },
    });

    return products || []; // Return products or an empty array
  } catch (error) {
    console.error(`Error fetching products for category "${categorySlug}":`, error);
    return [];
  }
};
