import * as adminService from '../services/admin.service.js';
import { sendSuccess } from '../utils/response.js';

// Orders
export async function getOrders(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const status = req.query.status;
    const search = req.query.search;

    const result = await adminService.getOrders({ page, limit, status, search });
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const order = await adminService.getOrderById(id);
    return sendSuccess(res, { order });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await adminService.updateOrderStatus(id, status);
    return sendSuccess(res, { order }, 200, 'Sipariş durumu güncellendi.');
  } catch (error) {
    next(error);
  }
}

// Users
export async function getUsers(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = req.query.search;

    const result = await adminService.getUsers({ page, limit, search });
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

// Categories
export async function createCategory(req, res, next) {
  try {
    const category = await adminService.createCategory(req.body);
    return sendSuccess(res, { category }, 201, 'Kategori oluşturuldu.');
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const category = await adminService.updateCategory(id, req.body);
    return sendSuccess(res, { category }, 200, 'Kategori güncellendi.');
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    await adminService.deleteCategory(id);
    return sendSuccess(res, {}, 200, 'Kategori pasife alındı.');
  } catch (error) {
    next(error);
  }
}

// Menu Items
export async function createMenuItem(req, res, next) {
  try {
    const item = await adminService.createMenuItem(req.body);
    return sendSuccess(res, { item }, 201, 'Menü ürünü oluşturuldu.');
  } catch (error) {
    next(error);
  }
}

export async function updateMenuItem(req, res, next) {
  try {
    const { id } = req.params;
    const item = await adminService.updateMenuItem(id, req.body);
    return sendSuccess(res, { item }, 200, 'Menü ürünü güncellendi.');
  } catch (error) {
    next(error);
  }
}

export async function deleteMenuItem(req, res, next) {
  try {
    const { id } = req.params;
    await adminService.deleteMenuItem(id);
    return sendSuccess(res, {}, 200, 'Menü ürünü pasife alındı.');
  } catch (error) {
    next(error);
  }
}

// Settings
export async function getSettings(req, res, next) {
  try {
    const settings = await adminService.getAllSettings();
    return sendSuccess(res, { settings });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const updated = await adminService.batchUpdateSettings(req.body);
    return sendSuccess(res, { settings: updated }, 200, 'Ayarlar güncellendi.');
  } catch (error) {
    next(error);
  }
}

// Gallery
export async function getGallery(req, res, next) {
  try {
    const items = await adminService.getGalleryItems(false);
    return sendSuccess(res, { items });
  } catch (error) {
    next(error);
  }
}

export async function createGalleryItem(req, res, next) {
  try {
    const item = await adminService.createGalleryItem(req.body);
    return sendSuccess(res, { item }, 201, 'Fotoğraf galeriye eklendi.');
  } catch (error) {
    next(error);
  }
}

export async function updateGalleryItem(req, res, next) {
  try {
    const { id } = req.params;
    const item = await adminService.updateGalleryItem(id, req.body);
    return sendSuccess(res, { item }, 200, 'Galeri fotoğrafı güncellendi.');
  } catch (error) {
    next(error);
  }
}

export async function deleteGalleryItem(req, res, next) {
  try {
    const { id } = req.params;
    await adminService.deleteGalleryItem(id);
    return sendSuccess(res, {}, 200, 'Fotoğraf galeriden silindi.');
  } catch (error) {
    next(error);
  }
}

export { uploadImage } from './upload.controller.js';



