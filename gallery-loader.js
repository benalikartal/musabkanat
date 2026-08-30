/**
 * Instant Dynamic Gallery Loader for Musab Kanat Izgara
 * Uses Stale-While-Revalidate caching for zero-flicker instant rendering.
 */

(function () {
  const API_BASE = window.location.port === '3000' ? 'http://localhost:4000/api' : '/api';
  const CACHE_KEY = 'musab_gallery_cache_v1';

  function renderItems(items) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid || !items) return;

    if (items.length === 0) {
      galleryGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:#777; padding:40px;">Henüz galeriye görsel eklenmemiş.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'border-radius: 12px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); background: #f5ede6;';

      const img = document.createElement('img');
      img.src = item.imageUrl;
      img.alt = item.title || 'Musab Kanat Izgara Lezzet Kareleri';
      img.style.cssText = 'width: 100%; height: 250px; object-fit: cover; transition: transform 0.5s ease; display: block;';
      img.loading = 'lazy';
      img.decoding = 'async';

      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.08)';
      });
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });

      wrap.appendChild(img);
      fragment.appendChild(wrap);
    });

    galleryGrid.innerHTML = '';
    galleryGrid.appendChild(fragment);
  }

  // 1. Render from cache immediately if available (0ms instant display)
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const cachedItems = JSON.parse(cached);
      renderItems(cachedItems);
    }
  } catch (e) {}

  // 2. Fetch fresh data from backend
  async function syncGallery() {
    try {
      const response = await fetch(`${API_BASE}/gallery`);
      if (!response.ok) return;

      const data = await response.json();
      if (data.success && Array.isArray(data.items)) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data.items));
        renderItems(data.items);
      }
    } catch (e) {
      console.debug('Gallery sync skipped:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncGallery);
  } else {
    syncGallery();
  }
})();
