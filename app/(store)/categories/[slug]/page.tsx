import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getProductsByCategory } from "@/sanity/lib/products/getProductsByCategory";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// export async function generateMetadata(
//   { params }: CategoryPageProps
// ): Promise<Metadata> {
//   const { slug } = await params;

//   const categoryName = slug
//     .replace(/[-_]/g, " ")
//     .replace(/\b\w/g, (char) => char.toUpperCase());

//   return {
//     title: `${categoryName} Collection`,
//     description: `Browse our ${categoryName} selection.`,
//   };
// }

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const products = (await getProductsByCategory(slug)) ?? [];
  const rawCategories = (await getAllCategories()) ?? [];

  const categories = rawCategories.map((cat) => ({
    ...cat,
    title: cat.title ?? undefined,
    slug: cat.slug ?? undefined,
    name: undefined,
  }));

  const categoryName = slug
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {categoryName} Collection
        </h1>
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}
