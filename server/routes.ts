import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import * as cheerio from "cheerio";
import cron from "node-cron";

async function scrapeProduct(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const name = $(".product-name").text().trim();
    const imageUrl = $(".product-image").attr("src") || "";
    const price = $(".price").text().trim();
    const releaseDateText = $(".release-date").text().trim();
    const releaseDate = new Date(releaseDateText);

    return {
      url,
      name,
      imageUrl,
      price,
      releaseDate,
    };
  } catch (error) {
    console.error("Failed to scrape product:", error);
    throw new Error("Failed to scrape product data");
  }
}

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
    } catch (error) {
      res.status(500).json({ error: "Failed to scrape product" });
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
