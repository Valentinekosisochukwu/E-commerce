import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductBySlug = async (slug: string) => {
  const PRODUCT_BY_ID_QUERY = defineQuery(`
    *[_type == "product" && slug.current == $slug][0]
  `);

  try {
        // Use sanityfetch to send the query with the slug as a parameter
    const { data } = await sanityFetch({
      query: PRODUCT_BY_ID_QUERY,
      params: { slug },
    });

        // Return the product data or  null if not found
    return data || null;
  } catch (error) {
    console.error(`Error fetching product with slug "${slug}":`, error);
    return null;
  }
};
