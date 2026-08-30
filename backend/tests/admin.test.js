import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/db.js';
import { signToken } from '../src/utils/jwt.js';

describe('Admin Endpoints', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const customerToken = signToken({ id: 'customer-1', role: 'CUSTOMER' });
  const adminToken = signToken({ id: 'admin-1', role: 'ADMIN' });

  describe('Authorization Checks', () => {
    it('should return 401 if request has no auth token', async () => {
      const res = await request(app).get('/api/admin/orders');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 403 if authenticated user is not an ADMIN', async () => {
      vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
        id: 'customer-1',
        role: 'CUSTOMER',
        isActive: true
      });

      const res = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('GET /api/admin/orders', () => {
    it('should allow admin to list orders', async () => {
      vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
        id: 'admin-1',
        role: 'ADMIN',
        isActive: true
      });

      vi.spyOn(prisma.order, 'count').mockResolvedValueOnce(1);
      vi.spyOn(prisma.order, 'findMany').mockResolvedValueOnce([
        {
          id: 'order-1',
          orderNumber: 'MK-260830-1111',
          customerName: 'Ali Veli',
          phone: '05551112233',
          total: 345.0,
          status: 'PENDING',
          items: []
        }
      ]);

      const res = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.orders).toHaveLength(1);
      expect(res.body.pagination.total).toBe(1);
    });
  });

  describe('PATCH /api/admin/orders/:id/status', () => {
    it('should allow admin to update order status', async () => {
      vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
        id: 'admin-1',
        role: 'ADMIN',
        isActive: true
      });

      vi.spyOn(prisma.order, 'findUnique').mockResolvedValueOnce({
        id: 'order-1',
        status: 'PENDING'
      });

      vi.spyOn(prisma.order, 'update').mockResolvedValueOnce({
        id: 'order-1',
        status: 'PREPARING'
      });

      const res = await request(app)
        .patch('/api/admin/orders/order-1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'PREPARING' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.order.status).toBe('PREPARING');
    });
  });

  describe('GET /api/admin/users', () => {
    it('should list users and never expose password / passwordHash', async () => {
      vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
        id: 'admin-1',
        role: 'ADMIN',
        isActive: true
      });

      vi.spyOn(prisma.user, 'count').mockResolvedValueOnce(1);
      vi.spyOn(prisma.user, 'findMany').mockResolvedValueOnce([
        {
          id: 'user-1',
          name: 'Müşteri 1',
          email: 'musteri@example.com',
          phone: '05553334455',
          role: 'CUSTOMER',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.users).toHaveLength(1);
      const user = res.body.users[0];
      expect(user.email).toBe('musteri@example.com');
      expect(user.password).toBeUndefined();
      expect(user.passwordHash).toBeUndefined();
    });
  });
});
