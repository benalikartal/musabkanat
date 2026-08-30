import { prisma } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';

// ================= ORDERS =================
export async function getOrders({ page = 1, limit = 20, status, search }) {
  const skip = (page - 1) * limit;
  const take = limit;

  try {
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
  } catch (error) {
    let filtered = [...fallbackStore.orders];
    if (status) {
      filtered = filtered.filter((o) => o.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(s) ||
          o.customerName.toLowerCase().includes(s) ||
          o.phone.includes(s)
      );
    }
    return {
      orders: filtered.slice(skip, skip + take),
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit)
      }
    };
  }
}

export async function getOrderById(id) {
  try {
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

    if (order) return order;
  } catch (error) {}

  const fbOrder = fallbackStore.orders.find((o) => o.id === id);
  if (!fbOrder) {
    const err = new Error('Sipariş bulunamadı.');
    err.statusCode = 404;
    err.code = 'ORDER_NOT_FOUND';
    throw err;
  }
  return fbOrder;
}

export async function updateOrderStatus(id, status) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true
      }
    });
    return updatedOrder;
  } catch (error) {
    const fbOrder = fallbackStore.orders.find((o) => o.id === id);
    if (fbOrder) {
      fbOrder.status = status;
      fbOrder.updatedAt = new Date();
      return fbOrder;
    }
    const err = new Error('Sipariş bulunamadı.');
    err.statusCode = 404;
    err.code = 'ORDER_NOT_FOUND';
    throw err;
  }
}

// ================= USERS =================
export async function getUsers({ page = 1, limit = 20, search }) {
  const skip = (page - 1) * limit;
  const take = limit;

  try {
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
  } catch (error) {
    let list = fallbackStore.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }));

    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
      );
    }

    return {
      users: list.slice(skip, skip + take),
      pagination: {
        total: list.length,
        page,
        limit,
        totalPages: Math.ceil(list.length / limit)
      }
    };
  }
}

// ================= MENU CATEGORIES =================
export async function createCategory(data) {
  try {
    return await prisma.menuCategory.create({ data });
  } catch (e) {
    const cat = { id: `cat-${Date.now()}`, ...data, createdAt: new Date(), updatedAt: new Date() };
    fallbackStore.categories.push(cat);
    return cat;
  }
}

export async function updateCategory(id, data) {
  try {
    return await prisma.menuCategory.update({ where: { id }, data });
  } catch (e) {
    const cat = fallbackStore.categories.find((c) => c.id === id);
    if (!cat) throw new Error('Kategori bulunamadı.');
    Object.assign(cat, data, { updatedAt: new Date() });
    return cat;
  }
}

export async function deleteCategory(id) {
  try {
    return await prisma.menuCategory.update({ where: { id }, data: { isActive: false } });
  } catch (e) {
    const cat = fallbackStore.categories.find((c) => c.id === id);
    if (!cat) throw new Error('Kategori bulunamadı.');
    cat.isActive = false;
    return cat;
  }
}

// ================= MENU ITEMS =================
export async function createMenuItem(data) {
  let categoryId = data.categoryId;

  if (!categoryId && data.categorySlug) {
    try {
      const cat = await prisma.menuCategory.findUnique({ where: { slug: data.categorySlug } });
      if (cat) categoryId = cat.id;
    } catch (e) {}
    if (!categoryId) {
      const fbCat = fallbackStore.categories.find((c) => c.slug === data.categorySlug);
      if (fbCat) categoryId = fbCat.id;
    }
  }

  const payload = {
    title: data.title,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: data.description || '',
    price: data.price,
    imageUrl: data.imageUrl,
    badge: data.badge || null,
    isActive: data.isActive !== undefined ? data.isActive : true,
    sortOrder: data.sortOrder || 0,
    categoryId: categoryId || 'cat-izgara-1'
  };

  try {
    return await prisma.menuItem.create({ data: payload });
  } catch (e) {
    const item = { id: `item-${Date.now()}`, ...payload, createdAt: new Date(), updatedAt: new Date() };
    fallbackStore.menuItems.push(item);
    return item;
  }
}

export async function updateMenuItem(id, data) {
  let categoryId = data.categoryId;
  if (!categoryId && data.categorySlug) {
    try {
      const cat = await prisma.menuCategory.findUnique({ where: { slug: data.categorySlug } });
      if (cat) categoryId = cat.id;
    } catch (e) {}
    if (!categoryId) {
      const fbCat = fallbackStore.categories.find((c) => c.slug === data.categorySlug);
      if (fbCat) categoryId = fbCat.id;
    }
  }

  const updateData = {
    ...(data.title && { title: data.title }),
    ...(data.slug && { slug: data.slug }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.price !== undefined && { price: data.price }),
    ...(data.imageUrl && { imageUrl: data.imageUrl }),
    ...(data.badge !== undefined && { badge: data.badge }),
    ...(data.isActive !== undefined && { isActive: data.isActive }),
    ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
    ...(categoryId && { categoryId })
  };

  try {
    return await prisma.menuItem.update({ where: { id }, data: updateData });
  } catch (e) {
    const item = fallbackStore.menuItems.find((m) => m.id === id);
    if (!item) throw new Error('Menü ürünü bulunamadı.');
    Object.assign(item, updateData, { updatedAt: new Date() });
    return item;
  }
}

export async function deleteMenuItem(id) {
  try {
    return await prisma.menuItem.update({ where: { id }, data: { isActive: false } });
  } catch (e) {
    const item = fallbackStore.menuItems.find((m) => m.id === id);
    if (!item) throw new Error('Menü ürünü bulunamadı.');
    item.isActive = false;
    return item;
  }
}

// ================= SETTINGS =================
export async function getAllSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const formatted = {};
    for (const s of settings) {
      try {
        formatted[s.key] = JSON.parse(s.value);
      } catch {
        formatted[s.key] = s.value;
      }
    }
    if (Object.keys(formatted).length > 0) return formatted;
  } catch (e) {}

  return fallbackStore.settings;
}

export async function updateSetting(key, value) {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    return await prisma.siteSetting.upsert({
      where: { key },
      update: { value: stringValue },
      create: { key, value: stringValue }
    });
  } catch (e) {
    fallbackStore.settings[key] = value;
    return { key, value };
  }
}

export async function batchUpdateSettings(settingsMap) {
  for (const [key, value] of Object.entries(settingsMap)) {
    await updateSetting(key, value);
  }
  return getAllSettings();
}

// ================= GALLERY =================
export async function getGalleryItems(includeInactive = false) {
  try {
    const items = await prisma.galleryItem.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    if (items && items.length > 0) return items;
  } catch (e) {}

  return fallbackStore.gallery.filter((g) => (includeInactive ? true : g.isActive));
}

export async function createGalleryItem(data) {
  try {
    return await prisma.galleryItem.create({ data });
  } catch (e) {
    const item = {
      id: `gal-${Date.now()}`,
      title: data.title || '',
      imageUrl: data.imageUrl,
      sortOrder: data.sortOrder || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    fallbackStore.gallery.push(item);
    return item;
  }
}

export async function updateGalleryItem(id, data) {
  try {
    return await prisma.galleryItem.update({ where: { id }, data });
  } catch (e) {
    const item = fallbackStore.gallery.find((g) => g.id === id);
    if (!item) throw new Error('Galeri görseli bulunamadı.');
    Object.assign(item, data, { updatedAt: new Date() });
    return item;
  }
}

export async function deleteGalleryItem(id) {
  try {
    return await prisma.galleryItem.update({ where: { id }, data: { isActive: false } });
  } catch (e) {
    const item = fallbackStore.gallery.find((g) => g.id === id);
    if (!item) throw new Error('Galeri görseli bulunamadı.');
    item.isActive = false;
    return item;
  }
}

