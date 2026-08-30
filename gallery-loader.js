/**
 * Dynamic Gallery Loader for Musab Kanat Izgara
 * Loads photos from the backend API, falls back gracefully if backend is offline.
 */

(function () {
  const API_BASE = window.location.port === '3000' ? 'http://localhost:4000/api' : '/api';

  async function loadDynamicGallery() {
    try {
      const response = await fetch(`${API_BASE}/gallery`);
      if (!response.ok) return;

      const data = await response.json();
      if (!data.success || !data.items || data.items.length === 0) return;

      const galleryGrid = document.getElementById('galleryGrid') || document.querySelector('.section .container > div[style*="grid"]');
      if (!galleryGrid) return;

      const fragment = document.createDocumentFragment();

      data.items.forEach((item) => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'border-radius: 12px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);';

        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = item.title || 'Musab Kanat Izgara Galeri';
        img.style.cssText = 'width: 100%; height: 250px; object-fit: cover; transition: transform 0.5s ease;';
        img.loading = 'lazy';
        img.decoding = 'async';

        img.addEventListener('mouseenter', () => {
          img.style.transform = 'scale(1.1)';
        });
        img.addEventListener('mouseleave', () => {
          img.style.transform = 'scale(1)';
        });

        wrap.appendChild(img);
        fragment.appendChild(wrap);
      });

      if (fragment.childNodes.length > 0) {
        galleryGrid.innerHTML = '';
        galleryGrid.appendChild(fragment);
      }
    } catch (e) {
      console.debug('Dynamic gallery fetch skipped:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDynamicGallery);
  } else {
    loadDynamicGallery();
  }
})();
