import { Router } from 'express';
import * as settingController from '../controllers/setting.controller.js';

const router = Router();

router.get('/public', settingController.getPublicSettings);

export default router;
