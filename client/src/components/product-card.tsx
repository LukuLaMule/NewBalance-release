import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Countdown } from "./countdown";
import type { Product } from "@shared/schema";
import { format } from "date-fns";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-contain bg-gray-50"
        />
      </div>

      <CardHeader className="pb-2">
        <h2 className="text-xl font-bold line-clamp-2">{product.name}</h2>
        <span className="text-2xl font-bold text-primary">{product.price}</span>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Date de sortie :</p>
            <p className="font-medium">
              {format(new Date(product.releaseDate), "PPP")}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Temps restant :</p>
            <Countdown targetDate={new Date(product.releaseDate)} />
          </div>

          <div className="text-xs text-muted-foreground">
            Dernière mise à jour : {format(new Date(product.lastUpdated), "Pp")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}