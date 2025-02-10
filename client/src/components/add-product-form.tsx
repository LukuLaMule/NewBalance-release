import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function AddProductForm() {
  const [url, setUrl] = useState("");
  const { toast } = useToast();
  
  const { mutate: addProduct, isPending } = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/products/scrape", { url });
      setUrl("");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit. Vérifiez l'URL.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes("newbalance.fr")) {
      toast({
        title: "URL invalide",
        description: "L'URL doit être une URL New Balance France",
        variant: "destructive",
      });
      return;
    }
    addProduct();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mb-8">
      <Input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Entrez l'URL d'une paire New Balance pour suivre sa date de sortie"
        className="flex-1"
        required
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Ajout..." : "Add Product"}
      </Button>
    </form>
  );
}
