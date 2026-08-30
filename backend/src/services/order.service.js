import { prisma } from '../config/db.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { Prisma } from '@prisma/client';

export async function createOrder({
  userId = null,
  customerName,
  phone,
  email = null,
  address,
  paymentMethod,
  customerNote = null,
  items
}) {
  // Extract item IDs to fetch from DB
  const itemIds = items.map((i) => i.menuItemId);

  // Fetch products from database
  const dbMenuItems = await prisma.menuItem.findMany({
    where: {
      id: { in: itemIds }
    }
  });

  const menuItemMap = new Map(dbMenuItems.map((item) => [item.id, item]));

  // Validate every requested item exists and is active
  for (const item of items) {
    const dbItem = menuItemMap.get(item.menuItemId);
    if (!dbItem) {
      const error = new Error(`Ürün bulunamadı (ID: ${item.menuItemId})`);
      error.statusCode = 400;
      error.code = 'INVALID_MENU_ITEM';
      throw error;
    }
    if (!dbItem.isActive) {
      const error = new Error(`"${dbItem.title}" şu anda satışta değil.`);
      error.statusCode = 400;
      error.code = 'MENU_ITEM_INACTIVE';
      throw error;
    }
  }

  // Calculate order items and total using precise Decimal arithmetic
  let subtotal = new Prisma.Decimal(0);
  const preparedOrderItems = [];

  for (const item of items) {
    const dbItem = menuItemMap.get(item.menuItemId);
    const unitPrice = new Prisma.Decimal(dbItem.price);
    const quantity = item.quantity;
    const lineTotal = unitPrice.mul(quantity);

    subtotal = subtotal.add(lineTotal);

    preparedOrderItems.push({
      menuItemId: dbItem.id,
      titleSnapshot: dbItem.title,
      unitPrice,
      quantity,
      note: item.note || null,
      lineTotal
    });
  }

  const total = subtotal; // If delivery fees or discounts are added later, adjust here
  const orderNumber = generateOrderNumber();

  // Create order and order items in a transaction
  const createdOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        address: address.trim(),
        paymentMethod,
        status: 'PENDING',
        subtotal,
        total,
        customerNote: customerNote ? customerNote.trim() : null,
        items: {
          create: preparedOrderItems.map((poi) => ({
            menuItemId: poi.menuItemId,
            titleSnapshot: poi.titleSnapshot,
            unitPrice: poi.unitPrice,
            quantity: poi.quantity,
            note: poi.note,
            lineTotal: poi.lineTotal
          }))
        }
      },
      include: {
        items: true
      }
    });

    return order;
  });

  return createdOrder;
}
