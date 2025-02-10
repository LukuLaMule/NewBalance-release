import { BaseScraper } from "./base-scraper";
import { NewBalanceScraper } from "./newbalance-scraper";
import { NikeScraper } from "./nike-scraper";
import { AdidasScraper } from "./adidas-scraper";

const scrapers: BaseScraper[] = [
  new NewBalanceScraper(),
  new NikeScraper(),
  new AdidasScraper(),
];

export async function scrapeProduct(url: string) {
  const scraper = scrapers.find(s => s.canHandle(url));
  if (!scraper) {
    throw new Error("Site non supporté. Nous supportons actuellement : New Balance, Nike et Adidas");
  }
  return await scraper.scrape(url);
}
