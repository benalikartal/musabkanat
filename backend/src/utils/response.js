/**
 * Standard API response helper utilities
 */

export function sendSuccess(res, data = {}, statusCode = 200, message = null) {
  const response = {
    success: true,
    ...(message && { message }),
    ...data
  };
  return res.status(statusCode).json(response);
}

export function sendError(res, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', message = 'Bir sunucu hatası oluştu.', details = []) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && details.length > 0 ? { details } : {})
    }
  });
}
