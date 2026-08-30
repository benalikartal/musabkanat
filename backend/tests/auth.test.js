import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/db.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../src/utils/jwt.js';

describe('Auth Endpoints', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return user and token without password', async () => {
      vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
      vi.spyOn(prisma.user, 'create').mockResolvedValueOnce({
        id: 'user-uuid-123',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        phone: '05551234567',
        role: 'CUSTOMER',
        isActive: true,
        createdAt: new Date()
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          phone: '05551234567',
          password: 'Password123!'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('ahmet@example.com');
      expect(res.body.user.password).toBeUndefined();
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(res.body.token).toBeDefined();
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should reject registration if email is already taken', async () => {
      vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
        id: 'existing-id',
        email: 'ahmet@example.com'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          phone: '05551234567',
          password: 'Password123!'
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
    });

    it('should fail validation if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          phone: '05551234567',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate valid credentials and set HttpOnly cookie', async () => {
      const hashedPassword = await bcrypt.hash('Secret123!', 10);
      vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
        id: 'user-uuid-123',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        phone: '05551234567',
        passwordHash: hashedPassword,
        role: 'CUSTOMER',
        isActive: true,
        createdAt: new Date()
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'ahmet@example.com',
          password: 'Secret123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('ahmet@example.com');
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should reject invalid password with generic error message', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPassword', 10);
      vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
        id: 'user-uuid-123',
        email: 'ahmet@example.com',
        passwordHash: hashedPassword,
        isActive: true
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'ahmet@example.com',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
      expect(res.body.error.message).toBe('E-posta veya şifre hatalı.');
    });

    it('should reject non-existent user with identical generic error message', async () => {
      vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
      expect(res.body.error.message).toBe('E-posta veya şifre hatalı.');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 if unauthenticated', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should return user info when authenticated via token header', async () => {
      const token = signToken({ id: 'user-uuid-123', role: 'CUSTOMER' });
      vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
        id: 'user-uuid-123',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        phone: '05551234567',
        role: 'CUSTOMER',
        isActive: true
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('ahmet@example.com');
    });
  });
});
