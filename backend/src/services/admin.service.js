import { prisma } from '../config/db.js';

// ================= ORDERS =================
export async function getOrders({ page = 1, limit = 20, status, search }) {
  const skip = (page - 1) * limit;
  const take = limit;

  const where = {
    ...(status && { status }),
    ...(search && {
      OR: [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const [totalCount, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })
  ]);

  return {
    orders,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
}

export async function getOrderById(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          menuItem: {
            select: {
              id: true,
              title: true,
              imageUrl: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      }
    }
  });

  if (!order) {
    const error = new Error('Sipariş bulunamadı.');
    error.statusCode = 404;
    error.code = 'ORDER_NOT_FOUND';
    throw error;
  }

  return order;
}

export async function updateOrderStatus(id, status) {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('Sipariş bulunamadı.');
    error.statusCode = 404;
    error.code = 'ORDER_NOT_FOUND';
    throw error;
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: true
    }
  });

  return updatedOrder;
}

// ================= USERS =================
export async function getUsers({ page = 1, limit = 20, search }) {
  const skip = (page - 1) * limit;
  const take = limit;

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const [totalCount, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
  ]);

  return {
    users,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
}

// ================= MENU CATEGORIES =================
export async function createCategory(data) {
  const existing = await prisma.menuCategory.findUnique({
    where: { slug: data.slug }
  });
  if (existing) {
    const error = new Error('Bu slug ile bir kategori zaten mevcut.');
    error.statusCode = 409;
    error.code = 'CATEGORY_SLUG_EXISTS';
    throw error;
  }

  return prisma.menuCategory.create({
    data
  });
}

export async function updateCategory(id, data) {
  const existing = await prisma.menuCategory.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('Kategori bulunamadı.');
    error.statusCode = 404;
    error.code = 'CATEGORY_NOT_FOUND';
    throw error;
  }

  return prisma.menuCategory.update({
    where: { id },
    data
  });
}

export async function deleteCategory(id) {
  // Soft delete to protect relational integrity
  const existing = await prisma.menuCategory.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('Kategori bulunamadı.');
    error.statusCode = 404;
    error.code = 'CATEGORY_NOT_FOUND';
    throw error;
  }

  return prisma.menuCategory.update({
    where: { id },
    data: { isActive: false }
  });
}

// ================= MENU ITEMS =================
export async function createMenuItem(data) {
  return prisma.menuItem.create({
    data
  });
}

export async function updateMenuItem(id, data) {
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('Menü ürünü bulunamadı.');
    error.statusCode = 404;
    error.code = 'ITEM_NOT_FOUND';
    throw error;
  }

  return prisma.menuItem.update({
    where: { id },
    data
  });
}

export async function deleteMenuItem(id) {
  // Soft delete to preserve order history
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('Menü ürünü bulunamadı.');
    error.statusCode = 404;
    error.code = 'ITEM_NOT_FOUND';
    throw error;
  }

  return prisma.menuItem.update({
    where: { id },
    data: { isActive: false }
  });
}

// ================= SETTINGS =================
export async function getAllSettings() {
  const settings = await prisma.siteSetting.findMany();
  const formatted = {};
  for (const s of settings) {
    try {
      formatted[s.key] = JSON.parse(s.value);
    } catch {
      formatted[s.key] = s.value;
    }
  }
  return formatted;
}

export async function updateSetting(key, value) {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value: stringValue },
    create: { key, value: stringValue }
  });
}

export async function batchUpdateSettings(settingsMap) {
  const results = [];
  for (const [key, value] of Object.entries(settingsMap)) {
    const res = await updateSetting(key, value);
    results.push(res);
  }
  return getAllSettings();
}
