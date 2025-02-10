import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Countdown } from "./countdown";
import type { Product } from "@shared/schema";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
      <motion.div 
        ref={ref}
        style={{
          transform: isInView ? "none" : "translateY(50px)",
          opacity: isInView ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s"
        }}
      >
        <div className="relative group">
          <motion.img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full object-contain bg-gradient-to-b from-gray-50 to-white p-4 sm:p-8 group-hover:scale-105 transition-transform duration-500"
            style={{ 
              maxHeight: "500px", 
              width: "100%", 
              objectFit: "contain"
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <CardHeader className="pb-2 text-center px-4 sm:px-8">
          <motion.h2 
            className="text-2xl sm:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {product.name}
          </motion.h2>
          <motion.span 
            className="text-3xl sm:text-5xl font-bold text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {product.price}
          </motion.span>
        </CardHeader>

        <CardContent className="px-4 sm:px-8 pb-8">
          <motion.div 
            className="space-y-6 sm:space-y-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div>
              <p className="text-base sm:text-xl text-muted-foreground mb-2">Date de sortie :</p>
              <p className="text-lg sm:text-2xl font-medium">
                {format(new Date(product.releaseDate), "PPP 'à' HH:mm")}
              </p>
            </div>

            <div>
              <p className="text-base sm:text-xl text-muted-foreground mb-2">Temps restant :</p>
              <Countdown targetDate={new Date(product.releaseDate)} />
            </div>

            <div className="text-xs sm:text-sm text-muted-foreground border-t pt-4 mt-4 opacity-75">
              Dernière mise à jour : {format(new Date(product.lastUpdated), "Pp")}
            </div>
          </motion.div>
        </CardContent>
      </motion.div>
    </Card>
  );
}