import type { InsertProduct } from "@shared/schema";

export abstract class BaseScraper {
  abstract canHandle(url: string): boolean;
  abstract scrape(url: string): Promise<InsertProduct>;
  
  protected getSource(url: string): "newbalance" | "nike" | "adidas" {
    if (url.includes("newbalance")) return "newbalance";
    if (url.includes("nike")) return "nike";
    if (url.includes("adidas")) return "adidas";
    throw new Error("Site non supporté");
  }
}
