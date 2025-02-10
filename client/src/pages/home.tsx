import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { AddProductForm } from "@/components/add-product-form";
import type { Product } from "@shared/schema";

export default function Home() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    async queryFn() {
      const res = await fetch("/api/products");
      return res.json();
    }
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl sm:text-5xl font-bold mb-4 sm:mb-8 text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          New Balance Release Countdown
        </h1>

        <AddProductForm />

        {isLoading ? (
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="h-[400px] sm:h-[600px] bg-white/50 animate-pulse rounded-xl shadow-lg" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-8 w-full max-w-4xl mx-auto px-4">
            {products.map((product) => (
              <ProductCard key={product.url} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Aucun produit suivi. Ajoutez une URL New Balance pour commencer.
          </div>
        )}
      </div>
    </div>
  );
}