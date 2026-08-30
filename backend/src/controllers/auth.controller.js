import * as authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
import { env } from '../config/env.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export async function register(req, res, next) {
  try {
    const { user, token } = await authService.registerUser(req.body);
    res.cookie('token', token, COOKIE_OPTIONS);
    return sendSuccess(res, { user, token }, 201, 'Kayıt başarılı.');
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res.cookie('token', token, COOKIE_OPTIONS);
    return sendSuccess(res, { user, token }, 200, 'Giriş başarılı.');
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  return sendSuccess(res, {}, 200, 'Çıkış yapıldı.');
}

export async function getMe(req, res) {
  return sendSuccess(res, { user: req.user });
}
