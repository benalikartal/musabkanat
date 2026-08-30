import { logger } from '../config/logger.js';
import { sendError } from '../utils/response.js';

export function notFoundHandler(req, res, next) {
  sendError(res, 404, 'NOT_FOUND', `İstenen endpoint bulunamadı: ${req.method} ${req.originalUrl}`);
}

export function globalErrorHandler(err, req, res, next) {
  logger.error({
    err: {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    },
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  }, 'Unhandled Application Error');

  if (err.type === 'entity.too.large') {
    return sendError(res, 413, 'PAYLOAD_TOO_LARGE', 'İstek boyutu izin verilen sınırı aşıyor (maks 100kb).');
  }

  if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    return sendError(res, 400, 'INVALID_JSON', 'Geçersiz JSON verisi gönderildi.');
  }

  const statusCode = err.statusCode || err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Sunucu tarafında beklenmeyen bir hata oluştu.'
    : err.message || 'Bir sunucu hatası oluştu.';

  return sendError(res, statusCode, code, message);
}
