import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/product-grid";
import type { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

export default function Home() {
  const [newProductUrl, setNewProductUrl] = useState("");
  const { toast } = useToast();
  const { data: products = [], isLoading, refetch } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleAddProduct = async () => {
    if (!newProductUrl.trim()) {
      toast({
        title: "URL requise",
        description: "Veuillez entrer l'URL d'un produit New Balance",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/products/scrape", {
        url: newProductUrl,
      });
      await refetch();
      setNewProductUrl("");
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit. Vérifiez l'URL.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl sm:text-5xl font-bold mb-4 sm:mb-8 text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          New Balance Release Countdown
        </h1>

        <div className="max-w-2xl mx-auto mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entrez l'URL d'une paire New Balance pour suivre sa date de sortie
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Exemple: https://www.newbalance.fr/fr/pd/1906l/U1906LV1-48987.html"
              value={newProductUrl}
              onChange={(e) => setNewProductUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddProduct} className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

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