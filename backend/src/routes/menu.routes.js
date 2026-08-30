import { Router } from 'express';
import * as menuController from '../controllers/menu.controller.js';

const router = Router();

router.get('/', menuController.getMenu);
router.get('/categories', menuController.getCategories);
router.get('/items', menuController.getItems);
router.get('/items/:id', menuController.getItemById);

export default router;
