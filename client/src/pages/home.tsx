import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/product-grid";
import type { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    async queryFn() {
      const res = await fetch("/api/products");
      const products = await res.json();

      if (products.length === 0) {
        await apiRequest("POST", "/api/products/scrape", {
          url: "https://www.newbalance.fr/fr/pd/1906l/U1906LV1-48987.html"
        });
        return [await (await fetch("/api/products")).json()];
      }

      return products;
    }
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl sm:text-5xl font-bold mb-4 sm:mb-8 text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          New Balance Release Countdown
        </h1>

        {isLoading ? (
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="h-[400px] sm:h-[600px] bg-white/50 animate-pulse rounded-xl shadow-lg" />
              ))}
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="w-full max-w-6xl mx-auto">
            <ProductGrid products={products} />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Chargement des produits...
          </div>
        )}
      </div>
    </div>
  );
}