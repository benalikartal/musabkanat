import { prisma } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';

export async function getPublicMenu() {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (categories && categories.length > 0) {
      return categories;
    }
  } catch (error) {}

  // Fallback store
  return fallbackStore.categories
    .filter((c) => c.isActive)
    .map((c) => ({
      ...c,
      items: fallbackStore.menuItems.filter((m) => m.categoryId === c.id && m.isActive)
    }));
}

export async function getCategories(includeInactive = false) {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    if (categories && categories.length > 0) return categories;
  } catch (error) {}

  return fallbackStore.categories.filter((c) => (includeInactive ? true : c.isActive));
}

export async function getMenuItems({ categorySlug, includeInactive = false }) {
  try {
    const where = {
      ...(includeInactive ? {} : { isActive: true }),
      ...(categorySlug && { category: { slug: categorySlug } })
    };

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    if (items && items.length > 0) return items;
  } catch (error) {}

  let items = fallbackStore.menuItems.filter((m) => (includeInactive ? true : m.isActive));
  if (categorySlug) {
    const cat = fallbackStore.categories.find((c) => c.slug === categorySlug);
    if (cat) {
      items = items.filter((m) => m.categoryId === cat.id);
    }
  }
  return items;
}

export async function getMenuItemById(id) {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    if (item) return item;
  } catch (error) {}

  const item = fallbackStore.menuItems.find((m) => m.id === id);
  if (!item || !item.isActive) {
    const error = new Error('Menü ürünü bulunamadı.');
    error.statusCode = 404;
    error.code = 'ITEM_NOT_FOUND';
    throw error;
  }
  return item;
}
