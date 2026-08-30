# Musab Kanat Izgara - Production-Ready Backend API

Musab Kanat Izgara restoran web sitesi için geliştirilmiş, PostgreSQL ve Prisma ORM tabanlı kurumsal RESTful API uygulaması.

---

## 🏛️ Mimari ve Teknoloji Yığını

- **Çalışma Zamanı:** Node.js 22+ (ES Modules)
- **Web Çerçevesi:** Express.js
- **Veritabanı & ORM:** PostgreSQL 16+ & Prisma ORM v6
- **Veri Doğrulama:** Zod
- **Kimlik Doğrulama:** JSON Web Token (JWT) + bcryptjs (12 round salt) + HttpOnly / Secure / SameSite Cookies
- **Güvenlik:** Helmet (HTTP Güvenlik Başlıkları), Express Rate Limit (Brute-Force & Abuse Koruması), CORS Origin Allowlist
- **Loglama:** Pino & Pino-Pretty (Yapılandırılmış ve hassas veri filtrelemeli logger)
- **Test Çerçevesi:** Vitest + Supertest

---

## 📂 Dizin Yapısı

```
backend/
├── docker-compose.yml       # Yerel PostgreSQL konteyneri
├── package.json             # Bağımlılıklar ve npm scriptleri
├── .env.example             # Örnek çevre değişkenleri
├── README.md                # Dokümantasyon
├── prisma/
│   ├── schema.prisma        # Veritabanı modelleri & ilişkiler
│   └── seed.js              # Admin kullanıcısı, kategoriler ve menü seed dosyası
├── src/
│   ├── config/
│   │   ├── env.js           # Zod ile doğrulanmış çevre değişkenleri
│   │   ├── db.js            # Prisma bağlantı ve yaşam döngüsü yönetimi
│   │   └── logger.js        # Pino yapılandırılmış log motoru (redaction destekli)
│   ├── controllers/         # İstek / Yanıt yöneticileri
│   ├── middleware/          # Auth, RBAC, Rate-Limit, ErrorHandler, Validator
│   ├── routes/              # API Endpoint tanımları
│   ├── services/            # İş mantığı ve veritabanı sorguları
│   ├── utils/               # Şifreleme, JWT, Sipariş Numarası ve Yanıt yardımcıları
│   ├── validators/          # Zod doğrulama şemaları
│   ├── app.js               # Express uygulama konfigürasyonu
│   └── server.js            # Sunucu başlangıcı & Graceful Shutdown
└── tests/                   # Vitest & Supertest otomatik testleri
```

---

## ⚙️ Gereksinimler

1. **Node.js**: v22.x veya üzeri (`node -v` ile kontrol edebilirsiniz)
2. **PostgreSQL**: v14+ (veya Docker Desktop)

---

## 🚀 Kurulum ve Başlatma

### 1. Bağımlılıkları Yükleyin
```bash
cd backend
npm install
```

### 2. Çevre Değişkenlerini Ayarlayın
`.env.example` dosyasını `.env` olarak kopyalayın:
```bash
cp .env.example .env
```

`.env` dosyasındaki değerleri düzenleyin:
- `JWT_SECRET`: Güçlü ve en az 32 karakterlik bir anahtar belirleyin. Üretmek için:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `DATABASE_URL`: PostgreSQL bağlantı URL'niz.
- `ADMIN_EMAIL` & `ADMIN_PASSWORD`: İlk veritabanı seed işlemi için admin giriş bilgileri.

### 3. PostgreSQL Başlatma (Docker ile)
Eğer yerel PostgreSQL kurulu değilse Docker Compose ile başlatabilirsiniz:
```bash
docker-compose up -d
```

### 4. Prisma Migration ve Seed
Veritabanı tablolarını oluşturun ve menü verilerini yükleyin:
```bash
# Tabloları oluştur
npx prisma migrate dev --name init

# Veya production ortamında
npm run prisma:deploy

# Menü ve admin verilerini veritabanına aktar
npm run prisma:seed
```

### 5. Sunucuyu Başlatın
- **Geliştirme Modu (Hot Reload):**
  ```bash
  npm run dev
  ```
- **Production Modu:**
  ```bash
  npm start
  ```

Sunucu varsayılan olarak `http://localhost:4000` adresinde çalışacaktır.

---

## 🧪 Testler

Tüm Auth, Menü, Sipariş, Güvenlik ve Admin API testlerini çalıştırmak için:
```bash
npm test
```

Testleri izleme (watch) modunda çalıştırmak için:
```bash
npm run test:watch
```

---

## 📡 API Endpoint Listesi

Base URL: `/api`

### 1. Sağlık Kontrolü
| Metot | Endpoint | Açıklama | Yetki |
|---|---|---|---|
| `GET` | `/api/health` | Sunucu ve DB bağlantı durumunu döner | Public |

### 2. Kimlik Doğrulama (Auth)
| Metot | Endpoint | Açıklama | Yetki |
|---|---|---|---|
| `POST` | `/api/auth/register` | Yeni müşteri kaydı | Public (Rate Limited: 5/saat) |
| `POST` | `/api/auth/login` | Giriş yapar, HttpOnly cookie yazar | Public (Rate Limited: 10/15dk) |
| `POST` | `/api/auth/logout` | Çıkış yapar, cookie temizler | Public |
| `GET` | `/api/auth/me` | Oturum açan kullanıcının bilgilerini döner | requireAuth |

### 3. Menü & Ayarlar (Public)
| Metot | Endpoint | Açıklama | Yetki |
|---|---|---|---|
| `GET` | `/api/menu` | Aktif kategorileri ve ürünleri döner | Public |
| `GET` | `/api/menu/categories` | Aktif kategorileri listeler | Public |
| `GET` | `/api/menu/items` | Ürünleri listeler (`?category=slug`) | Public |
| `GET` | `/api/menu/items/:id` | Tek ürün detayı | Public |
| `GET` | `/api/settings/public` | Public site ayarları (tema, iletişim vb.) | Public |

### 4. Sipariş (Order)
| Metot | Endpoint | Açıklama | Yetki |
|---|---|---|---|
| `POST` | `/api/orders` | Sipariş oluşturur (Fiyatı DB'den hesaplar) | Public / Optional Auth (Rate Limited) |

**Örnek Sipariş Gövdesi (`POST /api/orders`):**
```json
{
  "customerName": "Ali Kaya",
  "phone": "05551234567",
  "email": "ali@example.com",
  "address": "Kurtuluş Mah. Kıbrıs Cd. No: 10 D: 2 Efeler / Aydın",
  "paymentMethod": "CASH",
  "customerNote": "Zil çalmayın, kapıya bırakın lütfen.",
  "items": [
    {
      "menuItemId": "c0a80123-4567-89ab-cdef-0123456789ab",
      "quantity": 2,
      "note": "Acısı bol olsun"
    }
  ]
}
```

### 5. Yönetici Paneli (Admin)
*(Tüm endpointler `requireAuth` + `requireAdmin` korumalıdır)*

| Metot | Endpoint | Açıklama |
|---|---|---|
| `GET` | `/api/admin/orders` | Sipariş listesi (`?page=1&limit=20&status=PENDING&search=ali`) |
| `GET` | `/api/admin/orders/:id` | Sipariş detayları |
| `PATCH` | `/api/admin/orders/:id/status` | Sipariş durumu güncelleme (`status`: PENDING, CONFIRMED, PREPARING, READY, OUT_FOR_DELIVERY, DELIVERED, CANCELLED) |
| `GET` | `/api/admin/users` | Kullanıcı listesi (Şifreler ASLA dönmez) |
| `POST` | `/api/admin/menu/categories` | Yeni kategori oluşturma |
| `PATCH` | `/api/admin/menu/categories/:id` | Kategori güncelleme |
| `DELETE` | `/api/admin/menu/categories/:id` | Kategori pasife alma (Soft delete) |
| `POST` | `/api/admin/menu/items` | Yeni ürün ekleme |
| `PATCH` | `/api/admin/menu/items/:id` | Ürün güncelleme |
| `DELETE` | `/api/admin/menu/items/:id` | Ürünü pasife alma (Soft delete) |
| `GET` | `/api/admin/settings` | Tüm site ayarlarını görüntüleme |
| `PATCH` | `/api/admin/settings` | Site ayarlarını güncelleme |

---

## 🔒 Güvenlik Standartları

1. **Şifre Güvenliği:** Şifreler hiçbir zaman düz metin (plaintext) olarak tutulmaz ve loglanmaz. bcrypt (12 round salt) ile hashlenir.
2. **HttpOnly Cookies:** JWT token'ları tarayıcıda `localStorage` yerine XSS saldırılarına karşı korumalı `HttpOnly`, `SameSite: Lax`, `Secure: true` (production) cookie içinde taşınır.
3. **Fiyat Manipülasyon Koruması:** Müşteri/Frontend tarafından gönderilen sipariş tutarları backend tarafından yok sayılır; DB'deki güncel ürün fiyatları üzerinden hassas `Prisma.Decimal` ile yeniden hesaplanır.
4. **Veri Bütünlüğü:** Sipariş oluşturulduğunda ürünün anlık adı (`titleSnapshot`) ve birim fiyatı (`unitPrice`) sipariş satırına kaydedilir; ürün ileride güncellense dahi geçmiş sipariş kayıtları bozulmaz.
5. **Kritik Veri Koruması:** Admin paneli veya API yanıtlarında şifre, hash veya secret değerleri döndürülmez.
6. **XSS Önleme:** Admin paneli tüm dinamik içerikleri `textContent` ve güvenli DOM manipülasyonu ile işler.
7. **Rate Limiting:** Brute-force ve DDoS saldırılarına karşı login, register ve sipariş endpointlerinde katı hız sınırları uygulanmıştır.
