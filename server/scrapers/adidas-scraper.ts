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

      // Récupère le nom du produit
      const name = $('[data-auto-id="product-title"]').text().trim() ||
                  $('.gl-heading--m').first().text().trim();

      // Récupère l'URL de l'image principale en HD
      let imageUrl = $('[data-auto-id="pdp-image-carousel"] img').first().attr('src') ||
                    $('.pdp-image-viewer img').first().attr('src');

      // Assure qu'on a l'image en HD
      if (imageUrl) {
        // Adidas utilise souvent un paramètre de taille dans l'URL
        imageUrl = imageUrl.replace(/(\?.*)|$/, '?wid=2000&fmt=png-alpha&qlt=90');
      }

      // Récupère le prix
      const price = $('[data-auto-id="product-price"] .gl-price').first().text().trim() ||
                   $('.gl-price-item').first().text().trim();

      // Récupère la date de sortie
      let releaseDate = new Date();
      const releaseDateText = $('[data-auto-id="product-release-date"]').text().trim() ||
                            $('.coming-soon-label').text().trim();

      if (releaseDateText) {
        // Gère plusieurs formats de date possibles
        const dateMatch = releaseDateText.match(/(\d{2})\/(\d{2})\/(\d{4})|(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) {
          const [, day, month, year] = dateMatch;
          // Suppose que la sortie est à 10h du matin
          releaseDate = new Date(`${year}-${month}-${day}T10:00:00+01:00`);
        }
      }

      return {
        url,
        name,
        imageUrl: imageUrl || '',
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