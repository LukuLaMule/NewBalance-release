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
    <div className="min-h-screen bg-newbalance-light/20">
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
          className="font-montserrat text-3xl sm:text-5xl font-bold mb-6 sm:mb-12 text-center bg-gradient-to-r from-newbalance-dark via-newbalance to-newbalance-light bg-clip-text text-transparent"
        >
          New Balance Release Countdown
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-lg text-newbalance-dark/70 mb-8 font-medium"
        >
          Entrez l'URL d'une paire New Balance pour suivre sa date de sortie
        </motion.p>

        {isLoading ? (
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="h-[400px] sm:h-[600px] bg-newbalance-light/10 animate-pulse rounded-lg shadow-xl" />
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
          <div className="text-center text-newbalance-dark/70">
            Chargement du produit...
          </div>
        )}
      </motion.div>
    </div>
  );
}