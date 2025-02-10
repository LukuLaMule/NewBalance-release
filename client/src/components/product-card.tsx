import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Countdown } from "./countdown";
import type { Product } from "@shared/schema";
import { format } from "date-fns";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <img 
        src={product.imageUrl} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <span className="text-lg font-semibold">{product.price}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Release Date:</p>
            <p className="font-medium">
              {format(new Date(product.releaseDate), "PPP")}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Time Until Release:</p>
            <Countdown targetDate={new Date(product.releaseDate)} />
          </div>

          <div className="text-xs text-muted-foreground">
            Last updated: {format(new Date(product.lastUpdated), "Pp")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
