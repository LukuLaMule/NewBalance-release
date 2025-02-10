import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  releaseDate: timestamp("release_date").notNull(),
  price: text("price").notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
  source: text("source").notNull(),  // Ajout du champ source
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  lastUpdated: true,
}).extend({
  source: z.enum(["newbalance", "nike", "adidas"]), // Liste des sources supportées
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;