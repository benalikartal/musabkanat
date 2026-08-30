import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import menuRoutes from './menu.routes.js';
import orderRoutes from './order.routes.js';
import adminRoutes from './admin.routes.js';
import settingRoutes from './setting.routes.js';
import galleryRoutes from './gallery.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/settings', settingRoutes);
router.use('/gallery', galleryRoutes);

export default router;
