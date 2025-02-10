import { products, type Product, type InsertProduct } from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  upsertProduct(product: InsertProduct): Promise<Product>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private currentId: number;

  constructor() {
    this.products = new Map();
    this.currentId = 1;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async upsertProduct(insertProduct: InsertProduct): Promise<Product> {
    const existingProduct = Array.from(this.products.values()).find(
      (p) => p.url === insertProduct.url
    );

    if (existingProduct) {
      const updatedProduct = {
        ...existingProduct,
        ...insertProduct,
        lastUpdated: new Date(),
      };
      this.products.set(insertProduct.url, updatedProduct);
      return updatedProduct;
    }

    const newProduct: Product = {
      ...insertProduct,
      id: this.currentId++,
      lastUpdated: new Date(),
    };
    this.products.set(insertProduct.url, newProduct);
    return newProduct;
  }
}

export const storage = new MemStorage();
