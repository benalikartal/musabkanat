import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/db.js';
import { Prisma } from '@prisma/client';

describe('Order Endpoints', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /api/orders', () => {
    it('should create an order successfully and calculate total from DB prices (ignoring any client total)', async () => {
      // Mock db MenuItem with price 345.00
      vi.spyOn(prisma.menuItem, 'findMany').mockResolvedValueOnce([
        {
          id: 'item-kanat-1',
          title: 'Yaprak Kanat',
          price: new Prisma.Decimal(345.0),
          isActive: true
        }
      ]);

      // Mock transaction
      vi.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
        return callback({
          order: {
            create: vi.fn().mockImplementation(async ({ data }) => {
              return {
                id: 'order-uuid-1',
                orderNumber: data.orderNumber,
                customerName: data.customerName,
                subtotal: data.subtotal,
                total: data.total,
                status: 'PENDING',
                items: data.items.create
              };
            })
          }
        });
      });

      const res = await request(app)
        .post('/api/orders')
        .send({
          customerName: 'Mehmet Demir',
          phone: '05559876543',
          address: 'Aydın Efeler Kurtuluş Mah. No: 12',
          paymentMethod: 'CASH',
          customerNote: 'Acı bol olsun lütfen',
          // Malicious / incorrect client payload sending total = 10 TL
          total: 10.0,
          items: [
            {
              menuItemId: 'item-kanat-1',
              quantity: 2,
              note: 'İyi pişsin'
            }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order).toBeDefined();
      expect(res.body.order.orderNumber).toMatch(/^MK-\d{6}-\d{4}$/);
      expect(res.body.order.customerName).toBe('Mehmet Demir');
      // DB calculation: 2 * 345 = 690 TL
      expect(Number(res.body.order.total)).toBe(690);
    });

    it('should reject order if a menu item does not exist in DB', async () => {
      vi.spyOn(prisma.menuItem, 'findMany').mockResolvedValueOnce([]);

      const res = await request(app)
        .post('/api/orders')
        .send({
          customerName: 'Mehmet Demir',
          phone: '05559876543',
          address: 'Aydın Efeler Kurtuluş Mah. No: 12',
          paymentMethod: 'CASH',
          items: [
            {
              menuItemId: 'non-existent-item-id',
              quantity: 1
            }
          ]
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_MENU_ITEM');
    });

    it('should reject order if a menu item is inactive', async () => {
      vi.spyOn(prisma.menuItem, 'findMany').mockResolvedValueOnce([
        {
          id: 'inactive-item-id',
          title: 'Tükendi Kebap',
          price: new Prisma.Decimal(200.0),
          isActive: false
        }
      ]);

      const res = await request(app)
        .post('/api/orders')
        .send({
          customerName: 'Mehmet Demir',
          phone: '05559876543',
          address: 'Aydın Efeler Kurtuluş Mah. No: 12',
          paymentMethod: 'CASH',
          items: [
            {
              menuItemId: 'inactive-item-id',
              quantity: 1
            }
          ]
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('MENU_ITEM_INACTIVE');
    });

    it('should reject invalid quantities (e.g. 0 or negative or > 50)', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          customerName: 'Mehmet Demir',
          phone: '05559876543',
          address: 'Aydın Efeler Kurtuluş Mah. No: 12',
          paymentMethod: 'CASH',
          items: [
            {
              menuItemId: 'item-1',
              quantity: 0
            }
          ]
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
