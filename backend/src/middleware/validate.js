import { sendError } from '../utils/response.js';

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return sendError(res, 400, 'VALIDATION_ERROR', 'Gönderilen bilgiler geçersiz.', details);
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const details = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return sendError(res, 400, 'VALIDATION_ERROR', 'Sorgu parametreleri geçersiz.', details);
    }
    req.query = result.data;
    next();
  };
}
