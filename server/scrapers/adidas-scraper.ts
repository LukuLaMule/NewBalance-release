import { BaseScraper } from "./base-scraper";
import type { InsertProduct } from "@shared/schema";
import axios from "axios";
import * as cheerio from "cheerio";

export class AdidasScraper extends BaseScraper {
  canHandle(url: string): boolean {
    return url.includes("adidas.fr");
  }

  async scrape(url: string): Promise<InsertProduct> {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
          'Referer': 'https://www.adidas.fr'
        }
      });

      const $ = cheerio.load(data);
      
      // Sélecteurs adaptés au site Adidas
      const name = $('[data-auto-id="product-title"]').text().trim();
      const imageUrl = $('[data-auto-id="product-image"] img').first().attr('src') || '';
      const price = $('[data-auto-id="product-price"]').first().text().trim();
      const releaseDateText = $('[data-auto-id="product-release-date"]').text().trim();
      
      // Parser la date de sortie depuis le texte
      const releaseDate = new Date(releaseDateText);

      return {
        url,
        name,
        imageUrl,
        price,
        releaseDate,
        source: "adidas"
      };

    } catch (error) {
      console.error('Failed to scrape Adidas product:', error);
      throw new Error('Failed to scrape Adidas product data');
    }
  }
}
