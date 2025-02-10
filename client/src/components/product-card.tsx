import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Countdown } from "./countdown";
import type { Product } from "@shared/schema";
import { format } from "date-fns";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) * 0.15);
    mouseY.set((e.clientY - centerY) * 0.15);
  };

  const releaseDate = new Date(product.releaseDate);
  const lastUpdated = new Date(product.lastUpdated);

  return (
    <Card className="overflow-hidden bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
      <motion.div ref={ref} style={{
        transform: isInView ? "none" : "translateY(50px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s"
      }}>
        <div 
          className="relative group overflow-hidden cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
        >
          <motion.div 
            className="relative" 
            style={{
              y: smoothY,
              rotateX: useTransform(mouseY, [-50, 50], [5, -5]),
              rotateY: useTransform(mouseX, [-50, 50], [-5, 5]),
            }}
          >
            <motion.img
              src={product.imageUrl}
              alt={product.name}
              className="w-full object-contain bg-gradient-to-b from-newbalance-light/10 to-white p-4 sm:p-8"
              style={{
                maxHeight: "500px",
                width: "100%",
                objectFit: "contain",
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                y: useTransform(mouseY, [-50, 50], [10, -10]),
                x: useTransform(mouseX, [-50, 50], [10, -10]),
              }}
            />
          </motion.div>
        </div>

        <CardHeader className="pb-2 text-center px-4 sm:px-8">
          <motion.h2
            className="font-montserrat text-2xl sm:text-4xl font-bold mb-3 text-newbalance-dark"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {product.name}
          </motion.h2>
          <motion.span
            className="text-3xl sm:text-5xl font-bold text-newbalance"
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
              <p className="text-base sm:text-xl text-newbalance-dark/70 mb-2">Date de sortie :</p>
              <p className="text-lg sm:text-2xl font-medium text-newbalance">
                {format(releaseDate, "PPP 'à' HH:mm")}
              </p>
            </div>
            <div>
              <p className="text-base sm:text-xl text-newbalance-dark/70 mb-2">Temps restant :</p>
              <Countdown targetDate={releaseDate} />
            </div>

            <Button
              className="w-full sm:w-auto px-8 py-6 text-lg bg-newbalance hover:bg-newbalance-dark text-white transition-colors"
              asChild
            >
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-montserrat"
              >
                Voir sur New Balance <ExternalLink className="w-5 h-5" />
              </a>
            </Button>

            <div className="text-xs sm:text-sm text-newbalance-dark/50 border-t border-newbalance-light/20 pt-4 mt-4">
              Dernière mise à jour : {format(lastUpdated, "Pp")}
            </div>
          </motion.div>
        </CardContent>
      </motion.div>
    </Card>
  );
}