import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { updateOrderStatusSchema } from '../validators/order.validator.js';
import {
  createCategorySchema,
  updateCategorySchema,
  createMenuItemSchema,
  updateMenuItemSchema
} from '../validators/menu.validator.js';
import { batchUpdateSettingsSchema } from '../validators/setting.validator.js';

const router = Router();

// Apply auth & admin check to all admin routes
router.use(requireAuth, requireAdmin);

// Orders
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrderById);
router.patch('/orders/:id/status', validateBody(updateOrderStatusSchema), adminController.updateOrderStatus);

// Users / Customers
router.get('/users', adminController.getUsers);

// Menu Categories
router.post('/menu/categories', validateBody(createCategorySchema), adminController.createCategory);
router.patch('/menu/categories/:id', validateBody(updateCategorySchema), adminController.updateCategory);
router.delete('/menu/categories/:id', adminController.deleteCategory);

// Menu Items
router.post('/menu/items', validateBody(createMenuItemSchema), adminController.createMenuItem);
router.patch('/menu/items/:id', validateBody(updateMenuItemSchema), adminController.updateMenuItem);
router.delete('/menu/items/:id', adminController.deleteMenuItem);

// Settings
router.get('/settings', adminController.getSettings);
router.patch('/settings', validateBody(batchUpdateSettingsSchema), adminController.updateSettings);

export default router;
