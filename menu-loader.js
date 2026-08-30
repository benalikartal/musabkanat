/**
 * Dynamic Menu Loader for Musab Kanat Izgara
 * Fetches active menu items and categories from the backend API
 * Falls back gracefully to pre-rendered HTML if backend is unreachable.
 */

(function () {
  const API_BASE = window.location.port === '3000' ? 'http://localhost:4000/api' : '/api';

  async function loadDynamicMenu() {
    try {
      const response = await fetch(`${API_BASE}/menu`);
      if (!response.ok) return;

      const data = await response.json();
      if (!data.success || !data.categories || data.categories.length === 0) return;

      const menuGrid = document.querySelector('.menu-grid');
      if (!menuGrid) return;

      const newGridFragment = document.createDocumentFragment();

      data.categories.forEach((cat) => {
        if (!cat.items || cat.items.length === 0) return;

        cat.items.forEach((item) => {
          const card = document.createElement('div');
          card.className = 'menu-card';
          card.setAttribute('data-category', cat.slug);

          const imgWrapper = document.createElement('div');
          imgWrapper.className = 'menu-img-wrapper';

          const img = document.createElement('img');
          img.src = item.imageUrl;
          img.alt = `${item.title} - Musab Kanat Izgara`;
          img.className = 'menu-img';
          img.loading = 'lazy';
          img.decoding = 'async';
          imgWrapper.appendChild(img);

          if (item.badge) {
            const badge = document.createElement('span');
            badge.className = 'menu-badge';
            badge.textContent = item.badge;
            imgWrapper.appendChild(badge);
          }

          const price = document.createElement('div');
          price.className = 'menu-price';
          price.textContent = `${item.price} ₺`;
          imgWrapper.appendChild(price);

          const info = document.createElement('div');
          info.className = 'menu-info';

          const title = document.createElement('h3');
          title.className = 'menu-title';
          title.textContent = item.title;

          const desc = document.createElement('p');
          desc.className = 'menu-desc';
          desc.textContent = item.description;

          info.appendChild(title);
          info.appendChild(desc);

          card.appendChild(imgWrapper);
          card.appendChild(info);

          newGridFragment.appendChild(card);
        });
      });

      if (newGridFragment.childNodes.length > 0) {
        menuGrid.innerHTML = '';
        menuGrid.appendChild(newGridFragment);

        // Re-apply current active category filter
        const activeTab = document.querySelector('.category-tab.active');
        if (activeTab) {
          const filter = activeTab.getAttribute('data-filter');
          const cards = document.querySelectorAll('.menu-card');
          cards.forEach((card) => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        }
      }
    } catch (error) {
      // Backend not running or offline - fallback to static HTML without disruption
      console.debug('Dynamic menu fetch skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDynamicMenu);
  } else {
    loadDynamicMenu();
  }
})();
