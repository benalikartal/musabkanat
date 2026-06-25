const fs = require('fs');
const glob = require('fs').readdirSync('.');
const files = glob.filter(f => f.endsWith('.html'));

const newFooter = `<footer class="footer" style="padding-top: 60px; padding-bottom: 20px; text-align: center;">
        <div class="container">
            <h3 class="footer-logo" style="margin-bottom: 15px; font-size: 1.8rem; display: block;">Musab<span>Kanat</span></h3>
            <p style="color: rgba(253, 248, 245, 0.7); margin-bottom: 25px; font-size: 1rem;">Gerçek ızgara lezzetinin adresi.</p>
            <div class="social-links" style="display: flex; justify-content: center; gap: 15px; margin-bottom: 40px;">
                <a href="#" class="magnetic" style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; background-color: rgba(255, 255, 255, 0.1); border-radius: 50%; color: var(--color-cream); transition: var(--transition-fast);"><i class="fab fa-instagram"></i></a>
                <a href="#" class="magnetic" style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; background-color: rgba(255, 255, 255, 0.1); border-radius: 50%; color: var(--color-cream); transition: var(--transition-fast);"><i class="fab fa-facebook-f"></i></a>
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <p style="font-size: 0.9rem; color: rgba(253, 248, 245, 0.5);">&copy; 2026 Musab Kanat Izgara. Tüm Hakları Saklıdır.</p>
            </div>
        </div>
    </footer>`;

files.forEach(file => {
    let text = fs.readFileSync(file, 'utf8');
    
    // Use regex to match the entire footer block
    const footerRegex = /<footer class="footer">[\s\S]*?<\/footer>/;
    
    // Some files might already have the style="padding-top..." version
    const footerRegexAlt = /<footer class="footer" style="[^"]*">[\s\S]*?<\/footer>/;
    
    if (footerRegex.test(text)) {
        text = text.replace(footerRegex, newFooter);
    } else if (footerRegexAlt.test(text)) {
        text = text.replace(footerRegexAlt, newFooter);
    }
    
    fs.writeFileSync(file, text, 'utf8');
    console.log('Updated footer in', file);
});
