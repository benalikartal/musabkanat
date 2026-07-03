# Musab Kanat Izgara - SEO & GEO Raporu

Aşağıda web siteniz için gerçekleştirilen tüm teknik, yerel ve anlamsal optimizasyonların dökümü bulunmaktadır.

## 1. On-Page & Teknik SEO Geliştirmeleri
- **Meta Etiketler**: Tüm sayfaların title ve description (meta açıklama) etiketleri, yerel arama niyetlerine (Aydın Efeler kanat, ızgara vs.) uygun ve cezbedici şekilde baştan yazıldı.
- **Open Graph (OG) & Twitter Kartları**: Facebook, Twitter, WhatsApp gibi platformlarda siteniz paylaşıldığında zengin bir önizleme görünmesi için gerekli etiketler her sayfaya özel olarak eklendi.
- **Canonical Etiketi**: Yinelenen içerik (duplicate content) sorunlarını engellemek adına sayfaların başlıklarına canonical URL eklendi.
- **Preconnect (Ön Yükleme)**: Google Fonts bağlantıları için sayfa açılış hızını artırmak amacıyla preconnect etiketleri eklendi.
- **Dil ve Charset**: Tüm belgelerde UTF-8 ve `lang="tr"` yapısı korunarak doğrulandı.

## 2. Görsel SEO (Visual SEO) & Hız
- **Resim Alt Etiketleri (Alt Tags)**: Sitedeki tüm resimlere "Izgara Et" veya "Ateş" gibi jenerik kelimeler yerine, "Kömür ateşinde pişen özel soslu kanat - Aydın Efeler" gibi uzun kuyruklu (long-tail) anahtar kelimeler içeren betimleyici etiketler eklendi.
- **Lazy Loading**: İlk yüklemede görünmeyen (sayfanın alt kısımlarındaki) tüm resimlere `loading="lazy" decoding="async"` özelliği eklenerek sayfanın daha hızlı açılması sağlandı.
- **Video Preload ve Poster**: Ana sayfadaki hero videosuna `preload="metadata"` ile birlikte yüklenmeden önce görünen bir kapak fotoğrafı (`poster`) atandı.

## 3. Yapılandırılmış Veriler (Structured Data / Schema.org)
Google ve Bing gibi arama motorlarına sayfanın içeriğini matematiksel olarak açıklayan "JSON-LD" kodları entegre edildi:
- **Restaurant Schema**: Ana sayfada Musab Kanat Izgara'nın adı, adresi, telefon numarası, enlem-boylam koordinatları, açılış saatleri ve fiyat aralığını (₺₺) tanımlayan kapsamlı restoran şeması oluşturuldu.
- **FAQPage Schema**: Ana sayfaya eklenen Sıkça Sorulan Sorular için doğrudan soru-cevap yapısını barındıran FAQ şeması kuruldu. Bu, Google'ın "Kullanıcılar bunları da sordu" bölümlerinde doğrudan çıkma ihtimalinizi artırır.
- **Menu Schema**: Menü sayfasına "Ana Yemekler" ve "İçecekler" şeklinde kategorize edilmiş, her ürünün adı, açıklaması ve fiyatını (TRY cinsinden) içeren menü şeması eklendi.
- **BreadcrumbList**: Sitenizin navigasyon yapısını arama motorlarına bildiren Breadcrumb (Yol İzleri) şemaları tüm sayfalara eklendi.

## 4. Semantik HTML İyileştirmeleri
- **Navigasyon (Menü)**: Görme engelliler ve arama motorları botları için menülere `aria-label="Ana menü"` gibi erişilebilirlik (A11y) kuralları eklendi.
- **Haritalar**: Google Maps iFrame modülüne betimleyici `title` etiketi atandı.
- **Header Hiyerarşisi**: Sadece tek bir `<h1>` olacak şekilde yapılandırıldı ve diğer başlıklar hiyerarşik olarak `<h2>`, `<h3>` seviyelerine çekildi.

## 5. AEO / GEO (Yapay Zekâ Cevap Motoru) Optimizasyonu
ChatGPT, Gemini, Claude gibi yapay zeka modelleri ve Google'ın AI Overviews (SGE) yapısı için ana sayfaya özel bölümler eklendi:
- **Hedef Kelime Paragrafı**: "Aydın Efeler'de Gerçek Kömür Ateşi Lezzeti" başlıklı, arama niyetine doğrudan hitap eden yeni ve doğal akan bir paragraf yazıldı.
- **FAQ Bloğu (Sıkça Sorulan Sorular)**: Müşterilerin işletmenizle ilgili en çok sorabileceği 5 soru ("Musab Kanat nerede?", "Çalışma saatleri", "Paket servis", "Menü içerikleri" ve "Neden Musab Kanat tercih edilmeli?") doğrudan tasarımı bozmayacak bir biçimde koda eklendi.
- **LLMs.txt**: Yapay zekâ botlarının işletme bilgilerinizi doğrudan ve sade bir biçimde okuyabilmesi için ana dizinde özel bir `llms.txt` oluşturuldu.

## 6. Teknik Dosyalar ve NAP Uyumu
- **sitemap.xml**: Arama motoru botları için dinamik site haritası yazıldı.
- **robots.txt**: Site haritasını gösteren ve tüm arama motoru botlarına izin veren yeni `robots.txt` dosyası oluşturuldu.
- **humans.txt**: Sitenin standartlara uyduğunu anlatan künye dosyası eklendi.
- **NAP (Name, Address, Phone)**: Footer, iletişim alanı, şema işaretlemesi ve `llms.txt` dosyalarındaki isim, adres ve telefon verileri tamamen tutarlı (consistent) hale getirildi.

> Siteniz şu an yerel aramalarda parlamaya, Google Business Profilinizle güçlü bir bağ kurmaya ve yapay zeka motorlarında restoran önerilerinde çıkmaya tam olarak hazırdır.
