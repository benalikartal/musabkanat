const fs = require('fs');
const glob = require('fs').readdirSync('.');
const files = glob.filter(f => f.endsWith('.html'));

const replacements = {
    'images/cola.jpg': 'images/kola.jpg',
    'Kutu ecekler': 'Kutu İçecekler',
    'eitleri': 'çeşitleri',
    'zel Soslu Kanat': 'Özel Soslu Kanat',
    'Kasap Kfte': 'Kasap Köfte',
    'Kark Izgara Taba': 'Karışık Izgara Tabağı',
    'Tavuk i': 'Tavuk Şiş',
    'Kuzu i': 'Kuzu Şiş',
    'Ak Ayran': 'Açık Ayran',
    'algam Suyu': 'Şalgam Suyu',
    'Siparii': 'Siparişi',
    'Sipari': 'Sipariş',
    'stee Bal': 'İsteğe Bağlı',
    'rn: Acsz': 'Örn: Acısız',
    'rn Ad': 'Ürün Adı',
    'alma Saatleri': 'Çalışma Saatleri',
    'Tm Haklar Sakldr': 'Tüm Hakları Saklıdır',
    'letisim': 'İletişim',
    'deme Yntemi': 'Ödeme Yöntemi',
    'Kapda Nakit': 'Kapıda Nakit',
    'Kapda Kredi Kart': 'Kapıda Kredi Kartı',
    'Telefon Numaras': 'Telefon Numarası',
    'Hakkmzda': 'Hakkımızda',
    'Men': 'Menü',
    'Giri Yap': 'Giriş Yap',
    'Gerek': 'Gerçek',
    'Mkemmel': 'Mükemmel',
    'Gnlk': 'Günlük',
    'Taze rnler': 'Taze Ürünler',
    'Hzl': 'Hızlı'
};

files.forEach(file => {
    let text = fs.readFileSync(file, 'utf8');
    for (const [bad, good] of Object.entries(replacements)) {
        text = text.split(bad).join(good);
    }
    // Fix prices
    text = text.replace(/(\d+)\s*\?/g, '$1 ₺');
    fs.writeFileSync(file, text, 'utf8');
    console.log('Fixed', file);
});
