import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/db.js';

describe('Menu Endpoints', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/menu', () => {
    it('should return active categories and active menu items', async () => {
      const mockCategories = [
        {
          id: 'cat-1',
          name: 'Izgaralar & Yemekler',
          slug: 'izgara',
          sortOrder: 1,
          isActive: true,
          items: [
            {
              id: 'item-1',
              title: 'Yaprak Kanat',
              slug: 'yaprak-kanat',
              price: 345.0,
              isActive: true
            }
          ]
        }
      ];

      vi.spyOn(prisma.menuCategory, 'findMany').mockResolvedValueOnce(mockCategories);

      const res = await request(app).get('/api/menu');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.categories).toHaveLength(1);
      expect(res.body.categories[0].name).toBe('Izgaralar & Yemekler');
      expect(res.body.categories[0].items).toHaveLength(1);
    });
  });

  describe('GET /api/menu/items', () => {
    it('should filter items by category slug', async () => {
      const mockItems = [
        {
          id: 'item-1',
          title: 'Yaprak Kanat',
          slug: 'yaprak-kanat',
          price: 345.0,
          category: { id: 'cat-1', name: 'Izgaralar & Yemekler', slug: 'izgara' }
        }
      ];

      vi.spyOn(prisma.menuItem, 'findMany').mockResolvedValueOnce(mockItems);

      const res = await request(app).get('/api/menu/items?category=izgara');

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].title).toBe('Yaprak Kanat');
    });
  });
});
