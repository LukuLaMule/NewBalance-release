import { BaseScraper } from "./base-scraper";
import type { InsertProduct } from "@shared/schema";
import axios from "axios";
import * as cheerio from "cheerio";

export class NikeScraper extends BaseScraper {
  canHandle(url: string): boolean {
    return url.includes("nike.com");
  }

  async scrape(url: string): Promise<InsertProduct> {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
          'Referer': 'https://www.nike.com'
        }
      });

      const $ = cheerio.load(data);
      
      // Sélecteurs adaptés au site Nike
      const name = $('[data-test="product-title"]').text().trim();
      const imageUrl = $('picture img').first().attr('src') || '';
      const price = $('.product-price').first().text().trim();
      const releaseDateText = $('.available-date-component').text().trim();
      
      // Parser la date de sortie depuis le texte
      const releaseDate = new Date(releaseDateText);

      return {
        url,
        name,
        imageUrl,
        price,
        releaseDate,
        source: "nike"
      };

    } catch (error) {
      console.error('Failed to scrape Nike product:', error);
      throw new Error('Failed to scrape Nike product data');
    }
  }
}
