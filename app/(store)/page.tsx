import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import ProductsView from "@/components/ProductsView";
import BlackFridayBanner from "@/components/BlackFridayBanner";
import { Category } from "@/sanity.types";



export const dynamic = "force-static"; // Ensure the page is always dynamic
export const revalidate = 60; // Revalidate this page every 60 seconds

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  // console.log(
  //   crypto.randomUUID().slice(0, 5) +
  //     `>>> Rerendered the home page cache with ${products.length} products and $(categories.length) categories`
  // );

  
  return (
    <div>
      <BlackFridayBanner />

      {/* Render all the products */}
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
        <ProductsView products={products} categories={categories as Category[]}  />
      </div>
    </div>
  );
}
