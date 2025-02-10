import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto py-8 sm:py-12 px-4"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-5xl font-bold mb-6 sm:mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600"
        >
          New Balance Release Countdown
        </motion.h1>

        {isLoading ? (
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="h-[400px] sm:h-[600px] bg-gray-100 animate-pulse rounded-lg shadow-xl" />
          </div>
        ) : products.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-4xl mx-auto px-4"
          >
            <ProductCard product={products[0]} />
          </motion.div>
        ) : (
          <div className="text-center text-gray-500">
            Chargement du produit...
          </div>
        )}
      </motion.div>
    </div>
  );
}