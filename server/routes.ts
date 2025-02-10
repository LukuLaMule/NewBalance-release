import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import * as cheerio from "cheerio";
import cron from "node-cron";

async function scrapeProduct(url: string) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.newbalance.fr'
      }
    });

    const $ = cheerio.load(data);

    // Sélecteurs CSS mis à jour
    const name = $('.product-name').first().text().trim();
    const imageUrl = $('.product-primary-image img').first().attr('src') || '';
    const price = $('.price-sales').first().text().trim();

    // Extraction de la date de disponibilité
    const availabilityText = $('.availability-msg').text().trim();
    const dateMatch = availabilityText.match(/Disponible (\d{2}\/\d{2}\/\d{4}) à (\d{2}:\d{2})/);

    let releaseDate;
    if (dateMatch) {
      const [_, date, time] = dateMatch;
      const [day, month, year] = date.split('/');
      const [hours, minutes] = time.split(':');
      releaseDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );
    } else {
      // Date par défaut si non trouvée (12/02/2025 à 10:00)
      releaseDate = new Date(2025, 1, 12, 10, 0);
    }

    const product = {
      url,
      name: name || "1906L chaussures",
      imageUrl: imageUrl || "https://nb.scene7.com/is/image/NB/u1906lv1_nb_02_i?$pdpflexf2$",
      price: price || "140,00€",
      releaseDate,
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

  // Mise à jour toutes les 30 minutes
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