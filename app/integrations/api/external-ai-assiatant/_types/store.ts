// @/app/integrations/api/external/_types/store.ts
import { z } from "zod";

export const ProductSchema = z.object({
  product_id: z.string().min(1, "product_id is required"),
  tags: z.array(z.string()).optional().default([]),
  product_info: z
    .record(z.any())
    .refine(
      (data) => Object.keys(data).length > 0,
      "product_info must contain at least one field"
    ),
});

export const StoreRequestSchema = z.object({
  auth_secret: z.string().min(1, "auth_secret is required"),
  products: z.array(ProductSchema).min(1, "At least one product is required"),
});

export type Product = z.infer<typeof ProductSchema>;
export type StoreRequest = z.infer<typeof StoreRequestSchema>;
