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
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full object-contain bg-gray-50 p-8"
          style={{ maxHeight: "600px" }}
        />
      </div>

      <CardHeader className="pb-2 text-center">
        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
        <span className="text-4xl font-bold text-primary">{product.price}</span>
      </CardHeader>

      <CardContent>
        <div className="space-y-6 text-center">
          <div>
            <p className="text-lg text-muted-foreground mb-2">Date de sortie :</p>
            <p className="text-xl font-medium">
              {format(new Date(product.releaseDate), "PPP 'à' HH:mm")}
            </p>
          </div>

          <div>
            <p className="text-lg text-muted-foreground mb-2">Temps restant :</p>
            <Countdown targetDate={new Date(product.releaseDate)} />
          </div>

          <div className="text-sm text-muted-foreground border-t pt-4 mt-4">
            Dernière mise à jour : {format(new Date(product.lastUpdated), "Pp")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}