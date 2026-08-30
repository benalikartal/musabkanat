import * as menuService from '../services/menu.service.js';
import { sendSuccess } from '../utils/response.js';

export async function getMenu(req, res, next) {
  try {
    const menu = await menuService.getPublicMenu();
    return sendSuccess(res, { categories: menu });
  } catch (error) {
    next(error);
  }
}

export async function getCategories(req, res, next) {
  try {
    const categories = await menuService.getCategories();
    return sendSuccess(res, { categories });
  } catch (error) {
    next(error);
  }
}

export async function getItems(req, res, next) {
  try {
    const { category } = req.query;
    const items = await menuService.getMenuItems({ categorySlug: category });
    return sendSuccess(res, { items });
  } catch (error) {
    next(error);
  }
}

export async function getItemById(req, res, next) {
  try {
    const { id } = req.params;
    const item = await menuService.getMenuItemById(id);
    return sendSuccess(res, { item });
  } catch (error) {
    next(error);
  }
}
