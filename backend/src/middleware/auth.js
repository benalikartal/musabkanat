import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../config/db.js';
import { sendError } from '../utils/response.js';

export async function requireAuth(req, res, next) {
  try {
    let token = null;

    // Check cookies first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'UNAUTHORIZED', 'Lütfen giriş yapınız.');
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return sendError(res, 401, 'INVALID_TOKEN', 'Geçersiz veya süresi dolmuş oturum.');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user || !user.isActive) {
      return sendError(res, 401, 'ACCOUNT_INACTIVE', 'Kullanıcı hesabı bulunamadı veya pasif durumda.');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Yetkilendirme hatası.');
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return sendError(res, 403, 'FORBIDDEN', 'Bu işlem için yönetici yetkisi gereklidir.');
  }
  next();
}

export async function optionalAuth(req, res, next) {
  try {
    let token = null;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const payload = verifyToken(token);
      if (payload && payload.id) {
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isActive: true
          }
        });
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
  } catch (error) {
    // Ignore optional auth failures
  }
  next();
}
