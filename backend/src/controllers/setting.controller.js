import { prisma } from '../config/db.js';
import { sendSuccess } from '../utils/response.js';

export async function getPublicSettings(req, res, next) {
  try {
    const allowedKeys = ['active_theme', 'site_title', 'phone', 'working_hours', 'address'];

    const settings = await prisma.siteSetting.findMany({
      where: {
        key: { in: allowedKeys }
      }
    });

    const publicSettings = {};
    for (const s of settings) {
      try {
        publicSettings[s.key] = JSON.parse(s.value);
      } catch {
        publicSettings[s.key] = s.value;
      }
    }

    return sendSuccess(res, { settings: publicSettings });
  } catch (error) {
    next(error);
  }
}
