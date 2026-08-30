import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Kategori adı en az 2 karakter olmalıdır').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir'),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true)
});

export const updateCategorySchema = createCategorySchema.partial();

export const createMenuItemSchema = z.object({
  categoryId: z.string().optional(),
  categorySlug: z.string().optional(),
  title: z.string().min(2, 'Ürün adı en az 2 karakter olmalıdır').max(150),
  slug: z.string().max(150).optional(),
  description: z.string().max(500).default('').optional(),
  price: z.coerce.number().positive('Fiyat 0\'dan büyük olmalıdır'),
  imageUrl: z.string().min(1, 'Görsel yolu belirtilmelidir'),
  badge: z.string().max(50).nullable().optional(),
  sortOrder: z.coerce.number().int().default(0).optional(),
  isActive: z.boolean().default(true).optional()
});

export const updateMenuItemSchema = createMenuItemSchema.partial();
