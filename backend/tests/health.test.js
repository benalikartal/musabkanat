import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/db.js';

describe('GET /api/health', () => {
  it('should return health check status', async () => {
    vi.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([{ '1': 1 }]);

    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.service).toBe('musab-kanat-api');
    expect(res.body.database).toBe('connected');
  });
});
