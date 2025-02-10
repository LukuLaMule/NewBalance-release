import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scrapeProduct } from "./scrapers";
import cron from "node-cron";

export function registerRoutes(app: Express): Server {
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post("/api/products/scrape", async (req, res) => {
    try {
      const { url } = req.body;
      const productData = await scrapeProduct(url);
      const product = await storage.upsertProduct(productData);
      res.json(product);
    } catch (error: any) {
      console.error('Scraping error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  // Schedule scraping every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    try {
      const products = await storage.getProducts();
      for (const product of products) {
        const productData = await scrapeProduct(product.url);
        await storage.upsertProduct(productData);
      }
      console.log("Scheduled scraping completed");
    } catch (error) {
      console.error("Scheduled scraping failed:", error);
    }
  });

  return httpServer;
}