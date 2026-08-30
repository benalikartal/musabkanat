import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Musab Kanat Izgara database seeding...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@musabkanat.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'MusabAdmin2026!';
  const adminName = process.env.ADMIN_NAME || 'Musab Admin';
  const adminPhone = process.env.ADMIN_PHONE || '+905552194353';

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase().trim() },
    update: {
      name: adminName,
      phone: adminPhone,
      role: 'ADMIN',
      isActive: true,
      passwordHash
    },
    create: {
      name: adminName,
      email: adminEmail.toLowerCase().trim(),
      phone: adminPhone,
      passwordHash,
      role: 'ADMIN',
      isActive: true
    }
  });

  console.log(`✅ Admin user seeded: ${adminUser.email} (Role: ${adminUser.role})`);

  // 2. Seed Categories
  const categories = [
    {
      name: 'Izgaralar & Yemekler',
      slug: 'izgara',
      sortOrder: 1,
      isActive: true
    },
    {
      name: 'Tatlılar',
      slug: 'tatli',
      sortOrder: 2,
      isActive: true
    },
    {
      name: 'İçecekler',
      slug: 'icecek',
      sortOrder: 3,
      isActive: true
    }
  ];

  const categoryMap = {};

  for (const cat of categories) {
    const createdCat = await prisma.menuCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        sortOrder: cat.sortOrder,
        isActive: cat.isActive
      },
      create: cat
    });
    categoryMap[cat.slug] = createdCat.id;
    console.log(`✅ Category ready: ${createdCat.name} (${createdCat.slug})`);
  }

  // 3. Seed Menu Items (Exactly from menu.html)
  const menuItems = [
    // Izgaralar
    {
      categorySlug: 'izgara',
      title: 'Yaprak Kanat',
      slug: 'yaprak-kanat',
      description: 'Özel baharat harcımızla marine edilmiş, meşe kömürü ateşinde nar gibi kızarmış taze yaprak kanatlar.',
      price: 345.00,
      imageUrl: 'images/menu_wings.png',
      badge: 'Özel Soslu',
      sortOrder: 1,
      isActive: true
    },
    {
      categorySlug: 'izgara',
      title: 'Adana Kebap',
      slug: 'adana-kebap',
      description: 'Zırhta çekilmiş acılı kıyma harcından, kömür ateşinde ustalıkla pişirilen nefis Adana kebap.',
      price: 445.00,
      imageUrl: 'images/adana.jpg',
      badge: 'Acılı Kömür Ateşi',
      sortOrder: 2,
      isActive: true
    },
    {
      categorySlug: 'izgara',
      title: 'Urfa Kebap',
      slug: 'urfa-kebap',
      description: 'Özel baharatlarla harmanlanmış acısız kıyma harcından, köz ateşinde pişen lezzetli Urfa kebap.',
      price: 445.00,
      imageUrl: 'images/urfa_kebap.jpg',
      badge: 'Acısız Kömür Ateşi',
      sortOrder: 3,
      isActive: true
    },
    {
      categorySlug: 'izgara',
      title: 'Köfte',
      slug: 'kofte',
      description: 'Geleneksel tarifimize sadık kalarak, %100 taze etten hazırlanan sulu ve lezzetli ızgara köfteler.',
      price: 445.00,
      imageUrl: 'images/menu_kofte.png',
      badge: 'Özel Tarif',
      sortOrder: 4,
      isActive: true
    },
    {
      categorySlug: 'izgara',
      title: 'Tavuk Izgara',
      slug: 'tavuk-izgara',
      description: 'Özenle marine edilmiş, lokum kıvamında taze tavuk etlerinin mangalda eşsiz buluşması.',
      price: 345.00,
      imageUrl: 'images/tavuk_sis.jpg',
      badge: 'Lokum Kıvamında',
      sortOrder: 5,
      isActive: true
    },
    {
      categorySlug: 'izgara',
      title: 'Patates Kızartması',
      slug: 'patates-kizartmasi',
      description: 'Sıcak ve çıtır çıtır servis edilen altın sarısı patates kızartması porsiyonu.',
      price: 85.00,
      badge: 'Çıtır Porsiyon',
      sortOrder: 6,
      isActive: true
    },
    {
      categorySlug: 'izgara',
      title: 'Salata',
      slug: 'salata',
      description: 'Günlük taze doğranan domates, salatalık, biber, maydanoz ve sızma zeytinyağlı çoban salata.',
      price: 85.00,
      badge: 'Günlük Taze',
      sortOrder: 7,
      isActive: true
    },

    // Tatlılar
    {
      categorySlug: 'tatli',
      title: 'Kazan Dibi',
      slug: 'kazan-dibi',
      description: 'Karamelize edilmiş nefis tabanı ve taze sütlü hafif lezzetiyle geleneksel kazandibi.',
      price: 100.00,
      imageUrl: 'images/kazandibi.jpg',
      badge: 'Sütlü Tatlı',
      sortOrder: 1,
      isActive: true
    },
    {
      categorySlug: 'tatli',
      title: 'Kemal Paşa Tatlısı',
      slug: 'kemal-pasa-tatlisi',
      description: 'Tam kıvamında şerbeti ve özel sunumuyla damakta iz bırakan Kemalpaşa tatlısı.',
      price: 100.00,
      imageUrl: 'images/kemalpasa.jpg',
      badge: 'Şerbetli Klasik',
      sortOrder: 2,
      isActive: true
    },

    // İçecekler
    {
      categorySlug: 'icecek',
      title: 'Kola / Fanta / Sprite',
      slug: 'kola-fanta-sprite',
      description: 'Coca-Cola, Coca-Cola Zero, Fanta ve Sprite (Cam / Teneke kutu) serinletici çeşitleri.',
      price: 70.00,
      imageUrl: 'images/kola.jpg',
      badge: 'Soğuk İçecek',
      sortOrder: 1,
      isActive: true
    },
    {
      categorySlug: 'icecek',
      title: 'Fuse Tea (Soğuk Çay)',
      slug: 'fuse-tea',
      description: 'Şeftali, Limon, Karpuz ve Ananas-Mango aromalı ferahlatıcı soğuk çay çeşitleri.',
      price: 70.00,
      imageUrl: 'images/kola.jpg',
      badge: 'Ferahlatıcı',
      sortOrder: 2,
      isActive: true
    },
    {
      categorySlug: 'icecek',
      title: 'Cappy Meyve Suları',
      slug: 'cappy-meyve-sulari',
      description: 'Cappy Limonata (60 ₺), Teneke Şeftali, Vişne, Portakal ve Kayısı (70 ₺) çeşitleri.',
      price: 65.00,
      imageUrl: 'images/kola.jpg',
      badge: 'Meyve Suyu',
      sortOrder: 3,
      isActive: true
    },
    {
      categorySlug: 'icecek',
      title: 'Köpüklü Yayık Ayran',
      slug: 'kopuklu-yayik-ayran',
      description: 'Doğal yoğurttan günlük olarak hazırlanan, buz gibi ferahlatıcı açık ayran.',
      price: 60.00,
      imageUrl: 'images/ayran.jpg',
      badge: 'Ev Yapımı',
      sortOrder: 4,
      isActive: true
    },
    {
      categorySlug: 'icecek',
      title: 'Adana Şalgam Suyu',
      slug: 'adana-salgam-suyu',
      description: 'Tavuğun ve kebabın vazgeçilmezi, acılı veya acısız seçenekleriyle orijinal Adana şalgamı.',
      price: 45.00,
      imageUrl: 'images/salgam.jpg',
      badge: 'Acılı / Acısız',
      sortOrder: 5,
      isActive: true
    },
    {
      categorySlug: 'icecek',
      title: 'Soda (Maden Suyu)',
      slug: 'soda-maden-suyu',
      description: 'Yemek sonrası ferahlık veren buz gibi taze doğal mineral maden suyu.',
      price: 40.00,
      imageUrl: 'images/soda.jpg',
      badge: 'Mineral Maden Suyu',
      sortOrder: 6,
      isActive: true
    },
    {
      categorySlug: 'icecek',
      title: 'Taze Demleme Çay',
      slug: 'taze-demleme-cay',
      description: 'İnce belli bardakta taze demlenmiş tavşan kanı sıcak çay ikramı.',
      price: 20.00,
      imageUrl: 'images/cay.jpg',
      badge: 'Tavşan Kanı',
      sortOrder: 7,
      isActive: true
    },
    {
      categorySlug: 'icecek',
      title: 'Su',
      slug: 'su',
      description: 'Buz gibi taze ambalajlı kaynak suyu (500ml).',
      price: 20.00,
      imageUrl: 'images/su.jpg',
      badge: 'Kaynak Suyu',
      sortOrder: 8,
      isActive: true
    }
  ];

  for (const item of menuItems) {
    const categoryId = categoryMap[item.categorySlug];
    if (!categoryId) continue;

    const existing = await prisma.menuItem.findFirst({
      where: { slug: item.slug }
    });

    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: {
          categoryId,
          title: item.title,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          badge: item.badge,
          sortOrder: item.sortOrder,
          isActive: item.isActive
        }
      });
    } else {
      await prisma.menuItem.create({
        data: {
          categoryId,
          title: item.title,
          slug: item.slug,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          badge: item.badge,
          sortOrder: item.sortOrder,
          isActive: item.isActive
        }
      });
    }
    console.log(`✅ Menu item ready: ${item.title} (${item.price} TL)`);
  }

  // 4. Seed Initial Site Settings
  const settings = [
    { key: 'active_theme', value: JSON.stringify({ theme: 'classic', name: 'Klasik Tema' }) },
    { key: 'site_title', value: JSON.stringify({ title: 'Musab Kanat Izgara' }) },
    { key: 'phone', value: JSON.stringify({ landline: '+902562194353', mobile: '+905552194353' }) },
    { key: 'working_hours', value: JSON.stringify({ hours: 'Her gün: 12:00 - 02:00' }) },
    { key: 'address', value: JSON.stringify({ text: 'Kurtuluş Mah. Kıbrıs Cd. No: 38/B Efeler / Aydın' }) }
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s
    });
  }

  console.log('✅ Site settings seeded.');
  console.log(`🎉 Seeding completed successfully! Total categories: ${categories.length}, Total menu items: ${menuItems.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
