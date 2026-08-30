import { prisma } from '../config/db.js';

export async function getPublicMenu() {
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

  return categories;
}

export async function getCategories(includeInactive = false) {
  return prisma.menuCategory.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { sortOrder: 'asc' }
  });
}

export async function getMenuItems({ categorySlug, includeInactive = false }) {
  const where = {
    ...(includeInactive ? {} : { isActive: true }),
    ...(categorySlug && { category: { slug: categorySlug } })
  };

  return prisma.menuItem.findMany({
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
}

export async function getMenuItemById(id) {
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

  if (!item || !item.isActive) {
    const error = new Error('Menü ürünü bulunamadı.');
    error.statusCode = 404;
    error.code = 'ITEM_NOT_FOUND';
    throw error;
  }

  return item;
}
