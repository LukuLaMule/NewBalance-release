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

      // Récupère le nom du produit
      const name = $('.product-card__title').text().trim() || 
                  $('h1[data-test="product-title"]').text().trim();

      // Récupère l'URL de l'image principale en HD
      let imageUrl = $('.css-viwop1 img[data-component-type="image"]').first().attr('src') || 
                    $('.react-modal-image-img').first().attr('src') ||
                    $('.product-card__hero-image img').first().attr('src');

      // Assure qu'on a l'image en HD
      if (imageUrl) {
        imageUrl = imageUrl.replace(/(\?.*)|$/, '?wid=2000&hei=2000&fmt=png-alpha');
      }

      // Récupère le prix
      const price = $('.product-price').first().text().trim() ||
                   $('[data-test="product-price"]').first().text().trim();

      // Récupère la date de sortie
      let releaseDate = new Date();
      const releaseDateText = $('.available-date-component').text().trim() ||
                            $('[data-test="product-release-date"]').text().trim();

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
        source: "nike"
      };

    } catch (error) {
      console.error('Failed to scrape Nike product:', error);
      throw new Error('Failed to scrape Nike product data');
    }
  }
}