import { BaseScraper } from "./base-scraper";
import type { InsertProduct } from "@shared/schema";
import axios from "axios";
import * as cheerio from "cheerio";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class NewBalanceScraper extends BaseScraper {
  canHandle(url: string): boolean {
    return url.includes("newbalance.fr");
  }

  async scrape(url: string): Promise<InsertProduct> {
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        const { data } = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'Connection': 'keep-alive',
            'Referer': 'https://www.newbalance.fr/',
            'Cookie': 'nbCountry=FR; nbLocale=fr_FR'
          },
          timeout: 10000,
          maxRedirects: 5
        });

        const $ = cheerio.load(data);

        // Récupère le nom du produit
        const name = $('h1.product-name').text().trim();
        if (!name) {
          throw new Error("Impossible de trouver le nom du produit");
        }

        // Récupère l'URL de l'image principale en HD
        const imageUrl = $('.product-gallery__image-wrapper img').first().attr('src')?.replace(/(\?.*)|$/, '?$pdpflexf2$&wid=800&hei=800');
        if (!imageUrl) {
          throw new Error("Impossible de trouver l'image du produit");
        }

        // Récupère le prix
        const price = $('.product-price .sales .value').first().text().trim();
        if (!price) {
          throw new Error("Impossible de trouver le prix du produit");
        }

        // Récupère la date de sortie
        let releaseDate;
        const availabilityText = $('[data-availability]').text().trim();
        if (availabilityText) {
          const matches = availabilityText.match(/Disponible (\d{2})\/(\d{2})\/(\d{4}) à (\d{2}):(\d{2})/);
          if (matches) {
            const [, day, month, year, hours, minutes] = matches;
            releaseDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00+01:00`);
          }
        }

        if (!releaseDate) {
          releaseDate = new Date();
          releaseDate.setDate(releaseDate.getDate() + 30); // Par défaut, date à J+30
        }

        return {
          url,
          name,
          imageUrl,
          price,
          releaseDate,
          source: "newbalance"
        };

      } catch (error: any) {
        lastError = error;
        console.error(`Tentative ${4 - retries}/3 échouée:`, error.message);
        retries--;
        if (retries > 0) {
          // Attend 2 secondes entre chaque tentative
          await delay(2000);
          continue;
        }
      }
    }

    // Si toutes les tentatives ont échoué
    throw new Error(
      `Impossible de récupérer les informations du produit New Balance après 3 tentatives. ` +
      `Dernière erreur: ${lastError?.response?.status === 403 ? 
        "Le site bloque temporairement les requêtes automatisées. Veuillez réessayer dans quelques minutes." : 
        lastError?.message}`
    );
  }
}