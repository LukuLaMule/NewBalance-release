import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Countdown } from "./countdown";
import { NotificationButton } from "./notification-button";
import { CalendarExport } from "./calendar-export";
import type { Product } from "@shared/schema";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

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

      <CardContent className="px-4 sm:px-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center">
            <p className="text-base sm:text-lg text-muted-foreground mb-2">Date de sortie :</p>
            <p className="text-lg sm:text-2xl font-medium text-gray-900">
              {format(new Date(product.releaseDate), "PPP 'à' HH:mm")}
            </p>
          </div>

          <div className="text-center">
            <p className="text-base sm:text-lg text-muted-foreground mb-2">Temps restant :</p>
            <Countdown targetDate={new Date(product.releaseDate)} />
          </div>

          <div className="space-y-3">
            <NotificationButton 
              productName={product.name}
              releaseDate={new Date(product.releaseDate)}
              productUrl={product.url}
            />

            <div className="flex justify-center items-center gap-2">
              <CalendarExport product={product} />
              <Button variant="outline" size="sm" asChild className="flex-1">
                <a 
                  href={product.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Voir
                </a>
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground border-t pt-3">
            Dernière mise à jour : {format(new Date(product.lastUpdated), "Pp")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}