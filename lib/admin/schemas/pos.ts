import { z } from 'zod';

const transactionItemSchema = z.object({
  menu_item_id: z.string().uuid('Menu item tidak valid'),
  quantity: z.number().int().positive('Quantity harus lebih dari 0'),
});

export const posCreateSchema = z.object({
  items: z
    .array(transactionItemSchema)
    .min(1, 'Minimal 1 item')
    .max(50, 'Maksimal 50 item'),
  paid_cents: z.number().int().nonnegative('Uang dibayar tidak valid'),
  note: z.string().max(500).optional(),
  customer_phone: z.string().optional(),
  branch_id: z.string().uuid().optional(),
});

export type POSCreate = z.infer<typeof posCreateSchema>;
