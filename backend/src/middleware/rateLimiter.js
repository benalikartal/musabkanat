import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response.js';
import { env } from '../config/env.js';

// Global request rate limit
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  handler: (req, res) => {
    sendError(res, 429, 'TOO_MANY_REQUESTS', 'Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.');
  }
});

// Login brute force protection
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  handler: (req, res) => {
    sendError(res, 429, 'TOO_MANY_LOGIN_ATTEMPTS', 'Çok fazla başarısız giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.');
  }
});

// Register limit
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 registrations per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  handler: (req, res) => {
    sendError(res, 429, 'TOO_MANY_REGISTER_ATTEMPTS', 'Kayıt limiti aşıldı. Lütfen daha sonra tekrar deneyin.');
  }
});

// Order creation abuse limit
export const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15, // 15 orders per 10 min
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  handler: (req, res) => {
    sendError(res, 429, 'TOO_MANY_ORDER_ATTEMPTS', 'Sipariş verme sıklığınız çok yüksek. Lütfen birkaç dakika bekleyin.');
  }
});
