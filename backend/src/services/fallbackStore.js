import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

// Pre-hashed default password for instant local fallback
const defaultHash = bcrypt.hashSync('MusabAdmin2026!', 10);

export const fallbackStore = {
  isDbAvailable: false,

  users: [
    {
      id: 'admin-uuid-0001',
      name: env.ADMIN_NAME || 'Musab Admin',
      email: (env.ADMIN_EMAIL || 'admin@musabkanat.com').toLowerCase().trim(),
      phone: env.ADMIN_PHONE || '+905552194353',
      passwordHash: defaultHash,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  categories: [
    {
      id: 'cat-izgara-1',
      name: 'Izgaralar & Yemekler',
      slug: 'izgara',
      sortOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: []
    },
    {
      id: 'cat-tatli-2',
      name: 'Tatlılar',
      slug: 'tatli',
      sortOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: []
    },
    {
      id: 'cat-icecek-3',
      name: 'İçecekler',
      slug: 'icecek',
      sortOrder: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: []
    }
  ],

  menuItems: [
    {
      id: 'item-kanat-1',
      categoryId: 'cat-izgara-1',
      title: 'Yaprak Kanat',
      slug: 'yaprak-kanat',
      description: 'Özel baharat harcımızla marine edilmiş, meşe kömürü ateşinde nar gibi kızarmış taze yaprak kanatlar.',
      price: 345.00,
      imageUrl: 'images/menu_wings.png',
      badge: 'Özel Soslu',
      sortOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item-adana-2',
      categoryId: 'cat-izgara-1',
      title: 'Adana Kebap',
      slug: 'adana-kebap',
      description: 'Zırhta çekilmiş acılı kıyma harcından, kömür ateşinde ustalıkla pişirilen nefis Adana kebap.',
      price: 445.00,
      imageUrl: 'images/adana.jpg',
      badge: 'Acılı Kömür Ateşi',
      sortOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item-urfa-3',
      categoryId: 'cat-izgara-1',
      title: 'Urfa Kebap',
      slug: 'urfa-kebap',
      description: 'Özel baharatlarla harmanlanmış acısız kıyma harcından, köz ateşinde pişen lezzetli Urfa kebap.',
      price: 445.00,
      imageUrl: 'images/urfa_kebap.jpg',
      badge: 'Acısız Kömür Ateşi',
      sortOrder: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item-kofte-4',
      categoryId: 'cat-izgara-1',
      title: 'Köfte',
      slug: 'kofte',
      description: 'Geleneksel tarifimize sadık kalarak, %100 taze etten hazırlanan sulu ve lezzetli ızgara köfteler.',
      price: 445.00,
      imageUrl: 'images/menu_kofte.png',
      badge: 'Özel Tarif',
      sortOrder: 4,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item-tavuk-5',
      categoryId: 'cat-izgara-1',
      title: 'Tavuk Izgara',
      slug: 'tavuk-izgara',
      description: 'Özenle marine edilmiş, lokum kıvamında taze tavuk etlerinin mangalda eşsiz buluşması.',
      price: 345.00,
      imageUrl: 'images/tavuk_sis.jpg',
      badge: 'Lokum Kıvamında',
      sortOrder: 5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item-patates-6',
      categoryId: 'cat-izgara-1',
      title: 'Patates Kızartması',
      slug: 'patates-kizartmasi',
      description: 'Sıcak ve çıtır çıtır servis edilen altın sarısı patates kızartması porsiyonu.',
      price: 85.00,
      badge: 'Çıtır Porsiyon',
      sortOrder: 6,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item-salata-7',
      categoryId: 'cat-izgara-1',
      title: 'Salata',
      slug: 'salata',
      description: 'Günlük taze doğranan domates, salatalık, biber, maydanoz ve sızma zeytinyağlı çoban salata.',
      price: 85.00,
      badge: 'Günlük Taze',
      sortOrder: 7,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item-kazandibi-8',
      categoryId: 'cat-tatli-2',
      title: 'Kazan Dibi',
      slug: 'kazan-dibi',
      description: 'Karamelize edilmiş nefis tabanı ve taze sütlü hafif lezzetiyle geleneksel kazandibi.',
      price: 100.00,
      imageUrl: 'images/kazandibi.jpg',
      badge: 'Sütlü Tatlı',
      sortOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item-kemalpasa-9',
      categoryId: 'cat-tatli-2',
      title: 'Kemal Paşa Tatlısı',
      slug: 'kemal-pasa-tatlisi',
      description: 'Tam kıvamında şerbeti ve özel sunumuyla damakta iz bırakan Kemalpaşa tatlısı.',
      price: 100.00,
      imageUrl: 'images/kemalpasa.jpg',
      badge: 'Şerbetli Klasik',
      sortOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item-kola-10',
      categoryId: 'cat-icecek-3',
      title: 'Kola / Fanta / Sprite',
      slug: 'kola-fanta-sprite',
      description: 'Coca-Cola, Coca-Cola Zero, Fanta ve Sprite (Cam / Teneke kutu) serinletici çeşitleri.',
      price: 70.00,
      imageUrl: 'images/kola.jpg',
      badge: 'Soğuk İçecek',
      sortOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item-ayran-11',
      categoryId: 'cat-icecek-3',
      title: 'Köpüklü Yayık Ayran',
      slug: 'kopuklu-yayik-ayran',
      description: 'Doğal yoğurttan günlük olarak hazırlanan, buz gibi ferahlatıcı açık ayran.',
      price: 60.00,
      imageUrl: 'images/ayran.jpg',
      badge: 'Ev Yapımı',
      sortOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item-su-12',
      categoryId: 'cat-icecek-3',
      title: 'Su',
      slug: 'su',
      description: 'Buz gibi taze ambalajlı kaynak suyu (500ml).',
      price: 20.00,
      imageUrl: 'images/su.jpg',
      badge: 'Kaynak Suyu',
      sortOrder: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  orders: [
    {
      id: 'order-demo-1',
      orderNumber: 'MK-260830-1001',
      userId: null,
      customerName: 'Örnek Müşteri',
      email: 'musteri@example.com',
      phone: '0555 123 45 67',
      address: 'Kurtuluş Mah. Kıbrıs Cd. No: 12 Efeler / Aydın',
      paymentMethod: 'CASH',
      status: 'PENDING',
      subtotal: 445.00,
      total: 445.00,
      customerNote: 'Sıcak gelsin lütfen.',
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: 'oi-1',
          orderId: 'order-demo-1',
          menuItemId: 'item-kanat-1',
          titleSnapshot: 'Yaprak Kanat',
          unitPrice: 345.00,
          quantity: 1,
          note: 'Acılı sos',
          lineTotal: 345.00
        },
        {
          id: 'oi-2',
          orderId: 'order-demo-1',
          menuItemId: 'item-kazandibi-8',
          titleSnapshot: 'Kazan Dibi',
          unitPrice: 100.00,
          quantity: 1,
          note: null,
          lineTotal: 100.00
        }
      ]
    }
  ],

  settings: {
    active_theme: { theme: 'classic', name: 'Klasik Tema' },
    site_title: { title: 'Musab Kanat Izgara' },
    phone: { landline: '+902562194353', mobile: '+905552194353' }
  }
};
