import { prisma } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { fallbackStore } from './fallbackStore.js';

export async function registerUser({ name, email, phone, password }) {
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existing) {
      const error = new Error('Bu e-posta adresi ile kayıtlı bir hesap zaten var.');
      error.statusCode = 409;
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        passwordHash,
        role: 'CUSTOMER',
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    const token = signToken({ id: user.id, role: user.role });
    return { user, token };
  } catch (error) {
    if (error.statusCode === 409) throw error;
    // Fallback store when DB is not running
    const existingFallback = fallbackStore.users.find((u) => u.email === normalizedEmail);
    if (existingFallback) {
      const err = new Error('Bu e-posta adresi ile kayıtlı bir hesap zaten var.');
      err.statusCode = 409;
      err.code = 'EMAIL_ALREADY_EXISTS';
      throw err;
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash,
      role: 'CUSTOMER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    fallbackStore.users.push(newUser);

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt
    };

    const token = signToken({ id: safeUser.id, role: safeUser.role });
    return { user: safeUser, token };
  }
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();

  let user = null;

  try {
    user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });
  } catch (error) {
    // DB not reachable, check fallback store
    user = fallbackStore.users.find((u) => u.email === normalizedEmail);
  }

  // Fallback check if user not in DB or DB offline
  if (!user) {
    user = fallbackStore.users.find((u) => u.email === normalizedEmail);
  }

  if (!user || !user.isActive) {
    const error = new Error('E-posta veya şifre hatalı.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error('E-posta veya şifre hatalı.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const token = signToken({ id: user.id, role: user.role });

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt
  };

  return { user: safeUser, token };
}
