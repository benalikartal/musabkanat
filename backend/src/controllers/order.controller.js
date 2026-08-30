import * as orderService from '../services/order.service.js';
import { sendSuccess } from '../utils/response.js';

export async function createOrder(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const orderData = {
      ...req.body,
      userId
    };

    const order = await orderService.createOrder(orderData);

    return sendSuccess(res, { order }, 201, 'Siparişiniz başarıyla alındı.');
  } catch (error) {
    next(error);
  }
}
