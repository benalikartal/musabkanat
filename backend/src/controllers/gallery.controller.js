import * as adminService from '../services/admin.service.js';
import { sendSuccess } from '../utils/response.js';

export async function getGallery(req, res, next) {
  try {
    const items = await adminService.getGalleryItems(false);
    return sendSuccess(res, { items });
  } catch (error) {
    next(error);
  }
}
