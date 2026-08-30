import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { validateBody } from '../middleware/validate.js';
import { createOrderSchema } from '../validators/order.validator.js';
import { optionalAuth } from '../middleware/auth.js';
import { orderLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', orderLimiter, optionalAuth, validateBody(createOrderSchema), orderController.createOrder);

export default router;
