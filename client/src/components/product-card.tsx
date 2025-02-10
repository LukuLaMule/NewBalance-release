import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Countdown } from "./countdown";
import type { Product } from "@shared/schema";
import { format } from "date-fns";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow bg-white/80 backdrop-blur border-t-2 border-t-primary">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full object-contain bg-gradient-to-b from-gray-50 to-white p-4 sm:p-8"
          style={{ maxHeight: "400px", width: "100%", objectFit: "contain" }}
        />
      </div>

      <CardHeader className="pb-2 text-center px-4 sm:px-6">
        <h2 className="text-xl sm:text-3xl font-bold mb-2 text-gray-900">{product.name}</h2>
        <span className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{product.price}</span>
      </CardHeader>

      <CardContent className="px-4 sm:px-8">
        <div className="space-y-6 sm:space-y-8 text-center">
          <div>
            <p className="text-base sm:text-lg text-muted-foreground mb-2">Date de sortie :</p>
            <p className="text-lg sm:text-2xl font-medium text-gray-900">
              {format(new Date(product.releaseDate), "PPP 'à' HH:mm")}
            </p>
          </div>

          <div>
            <p className="text-base sm:text-lg text-muted-foreground mb-2">Temps restant :</p>
            <Countdown targetDate={new Date(product.releaseDate)} />
          </div>

          <div className="text-xs sm:text-sm text-muted-foreground border-t pt-4 mt-4">
            Dernière mise à jour : {format(new Date(product.lastUpdated), "Pp")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}