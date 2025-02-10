import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  // Charger automatiquement la paire New Balance 1906L au démarrage
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    async queryFn() {
      // Si aucun produit n'existe, ajouter automatiquement la paire New Balance
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">New Balance Release Countdown</h1>

        {isLoading ? (
          <div className="max-w-3xl mx-auto">
            <div className="h-[600px] bg-gray-100 animate-pulse rounded-lg" />
          </div>
        ) : products.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            <ProductCard product={products[0]} />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Chargement du produit...
          </div>
        )}
      </div>
    </div>
  );
}