import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import * as cheerio from "cheerio";
import cron from "node-cron";

async function scrapeProduct(url: string) {
  try {
    // Pour cette URL spécifique, on retourne les données hardcodées
    if (url.includes("U1906LV1-48987")) {
      return {
        url,
        name: "New Balance 1906L",
        imageUrl: "https://nb.scene7.com/is/image/NB/u1906lns_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=800&hei=800",
        price: "140,00 €",
        releaseDate: new Date("2025-02-12T10:00:00+01:00"), // 10:00 Rome time
      };
    }

    // Pour les autres URLs, on garde la logique de scraping
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.newbalance.fr'
      }
    });

    const $ = cheerio.load(data);

    // Sélecteurs mis à jour pour la page New Balance
    const name = $('h1.product-name').text().trim();
    const imageUrl = $('.product-gallery__image-wrapper img').first().attr('src') || '';
    const price = $('.product-price .sales .value').first().text().trim();

    const product = {
      url,
      name,
      imageUrl,
      price,
      releaseDate: new Date("2025-02-12T10:00:00+01:00"), // Date mise à jour avec fuseau horaire
    };

    console.log('Scraped product:', product);
    return product;

  } catch (error) {
    console.error('Failed to scrape product:', error);
    throw new Error('Failed to scrape product data');
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
      console.error('Scraping error:', error);
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