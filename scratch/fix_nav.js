const fs = require('fs');
const files = require('fs').readdirSync('.').filter(f => f.endsWith('.html'));

const oldCart = `<li class="cart-menu-item" style="margin-left: 15px; margin-top: 5px;">
                        <a href="#" class="nav-link" onclick="toggleCart(event)" style="position: relative; font-size: 1.2rem;">`;
const newCart = `<li class="cart-menu-item" style="margin-left: 15px; display: flex; align-items: center;">
                        <a href="#" class="nav-link" onclick="toggleCart(event)" style="position: relative; font-size: 1.2rem; display: flex; align-items: center;">`;

const oldAuth = `<li class="auth-menu-item" id="auth-menu-wrapper" style="margin-left: 15px;">`;
const newAuth = `<li class="auth-menu-item" id="auth-menu-wrapper" style="margin-left: 15px; display: flex; align-items: center; gap: 15px;">`;

files.forEach(f => {
    let text = fs.readFileSync(f, 'utf8');
    if(text.includes(oldCart)) {
        text = text.replace(oldCart, newCart);
    }
    if(text.includes(oldAuth)) {
        text = text.replace(oldAuth, newAuth);
    }
    fs.writeFileSync(f, text, 'utf8');
    console.log('Fixed navbar in', f);
});
