'use client';

import { Product } from '@/sanity.types';
import dynamic from 'next/dynamic';

const ProductDetails = dynamic(() => import('./ProductDetails'), {
  ssr: false,
  loading: () => <p>Loading product...</p>,
});

export default function ProductDetailsWrapper({ product }: { product: Product }) {
  return <ProductDetails product={product} />;
}
