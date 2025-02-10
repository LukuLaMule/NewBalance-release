import { BaseScraper } from "./base-scraper";
import type { InsertProduct } from "@shared/schema";
import axios from "axios";
import * as cheerio from "cheerio";

export class NewBalanceScraper extends BaseScraper {
  canHandle(url: string): boolean {
    return url.includes("newbalance.fr");
  }

  async scrape(url: string): Promise<InsertProduct> {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
          'Referer': 'https://www.newbalance.fr'
        }
      });

      const $ = cheerio.load(data);

      // Récupère le nom du produit
      const name = $('h1.product-name').text().trim();

      // Récupère l'URL de l'image principale en HD
      const imageUrl = $('.product-gallery__image-wrapper img').first().attr('src')?.replace(/(\?.*)|$/, '?$pdpflexf2$&wid=800&hei=800') || '';

      // Récupère le prix
      const price = $('.product-price .sales .value').first().text().trim();

      // Récupère la date de sortie si disponible dans un élément avec data-availability
      let releaseDate;
      const availabilityText = $('[data-availability]').text().trim();
      if (availabilityText) {
        const matches = availabilityText.match(/Disponible (\d{2})\/(\d{2})\/(\d{4}) à (\d{2}):(\d{2})/);
        if (matches) {
          const [, day, month, year, hours, minutes] = matches;
          releaseDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00+01:00`);
        }
      }

      // Si pas de date trouvée, utiliser la date par défaut
      if (!releaseDate) {
        releaseDate = new Date("2025-02-12T10:00:00+01:00");
      }

      return {
        url,
        name,
        imageUrl,
        price,
        releaseDate,
        source: "newbalance"
      };
    } catch (error) {
      console.error('Failed to scrape NewBalance product:', error);
      throw new Error('Failed to scrape NewBalance product data');
    }
  }
}