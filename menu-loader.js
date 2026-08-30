/**
 * Instant Dynamic Menu Loader for Musab Kanat Izgara
 * Uses Stale-While-Revalidate caching for zero-flicker instant rendering.
 */

(function () {
  const API_BASE = window.location.port === '3000' ? 'http://localhost:4000/api' : '/api';
  const CACHE_KEY = 'musab_menu_cache_v1';

  function renderCategories(categories) {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid || !categories) return;

    const newGridFragment = document.createDocumentFragment();

    categories.forEach((cat) => {
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
        img.onerror = () => { img.src = 'images/musab_logo.png'; };
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
        desc.textContent = item.description || '';

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
      const filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
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

  // 1. Render from cache immediately if available (0ms instant display)
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const cachedData = JSON.parse(cached);
      renderCategories(cachedData);
    }
  } catch (e) {}

  // 2. Fetch fresh data from backend
  async function syncMenu() {
    try {
      const response = await fetch(`${API_BASE}/menu`);
      if (!response.ok) return;

      const data = await response.json();
      if (data.success && Array.isArray(data.categories)) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data.categories));
        renderCategories(data.categories);
      }
    } catch (error) {
      console.debug('Menu sync skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncMenu);
  } else {
    syncMenu();
  }
})();
