import { useQuery, useMutation } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function Home() {
  const [url, setUrl] = useState("");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { mutate: scrapeProduct, isPending } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/products/scrape", { url });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product added successfully",
        description: "The product details have been scraped and saved.",
      });
      setUrl("");
    },
    onError: () => {
      toast({
        title: "Failed to add product",
        description: "Please check the URL and try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">New Balance Release Countdown</h1>
      
      <div className="flex gap-4 mb-8">
        <Input
          placeholder="Enter New Balance product URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={() => scrapeProduct()}
          disabled={!url || isPending}
        >
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
