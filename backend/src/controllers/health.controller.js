import { prisma } from '../config/db.js';

export async function checkHealth(req, res) {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }

  const isHealthy = dbStatus === 'connected';

  return res.status(isHealthy ? 200 : 503).json({
    ok: isHealthy,
    service: 'musab-kanat-api',
    status: isHealthy ? 'UP' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime()
  });
}
