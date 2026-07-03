* Bu JS koruması sadece basit botları caydırır.
* Gerçek koruma Cloudflare üzerinden yapılmalıdır.
* Cloudflare’da önerilen ayarlar:

  * Bot Fight Mode aç.
  * WAF Custom Rules ile `curl`, `wget`, `python-requests`, `scrapy`, `HeadlessChrome`, `PhantomJS`, `Go-http-client` user-agent’larını block/challenge yap.
  * Ana HTML sayfalarında şüpheli trafiğe Managed Challenge uygula.
  * `/images/*`, `.css`, `.js`, `.mp4`, `.jpg`, `.png`, `.webp` gibi statik assetleri challenge ile bozma.
* Googlebot/Bingbot gibi arama motorlarını engelleme; restoran sitesi SEO’dan trafik almalı.
