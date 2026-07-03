(function () {
  try {
    const KEY = "mk_bot_guard_verified_until";
    const now = Date.now();
    const verifiedUntil = Number(localStorage.getItem(KEY) || 0);

    if (verifiedUntil > now) return;

    const ua = navigator.userAgent || "";
    const badUaPatterns = [
      /headlesschrome/i,
      /phantomjs/i,
      /selenium/i,
      /puppeteer/i,
      /playwright/i,
      /curl/i,
      /wget/i,
      /python-requests/i,
      /scrapy/i,
      /httpclient/i,
      /libwww/i,
      /go-http-client/i,
      /axios/i
    ];

    const goodBotPatterns = [
      /googlebot/i,
      /bingbot/i,
      /duckduckbot/i,
      /yandexbot/i
    ];

    if (goodBotPatterns.some((r) => r.test(ua))) return;

    let score = 0;

    if (navigator.webdriver) score += 3;
    if (badUaPatterns.some((r) => r.test(ua))) score += 3;
    if (!navigator.languages || navigator.languages.length === 0) score += 1;
    if (!navigator.plugins || navigator.plugins.length === 0) score += 1;
    if (window.outerWidth === 0 || window.outerHeight === 0) score += 2;

    function approve() {
      localStorage.setItem(KEY, String(Date.now() + 24 * 60 * 60 * 1000));
      const guard = document.getElementById("mk-bot-guard");
      if (guard) guard.remove();
      document.documentElement.classList.remove("mk-guard-active");
    }

    function showChallenge(hardBlock) {
      document.documentElement.classList.add("mk-guard-active");

      const style = document.createElement("style");
      style.textContent = `
        .mk-guard-active body { overflow: hidden; }
        #mk-bot-guard {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: radial-gradient(circle at top, #4A3026 0%, #2E1E17 55%, #120b08 100%);
          color: #fff;
          font-family: Inter, Arial, sans-serif;
        }
        .mk-guard-card {
          width: min(440px, 100%);
          background: rgba(253, 248, 245, 0.08);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 18px;
          padding: 28px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
          backdrop-filter: blur(14px);
        }
        .mk-guard-card h2 {
          margin: 0 0 12px;
          font-size: 24px;
          color: #FDF8F5;
        }
        .mk-guard-card p {
          margin: 0 0 22px;
          color: rgba(255,255,255,0.78);
          line-height: 1.6;
        }
        .mk-guard-card button {
          width: 100%;
          border: 0;
          border-radius: 999px;
          padding: 14px 20px;
          background: #C48B58;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
        }
        .mk-guard-card button:hover {
          filter: brightness(1.08);
        }
      `;
      document.head.appendChild(style);

      const overlay = document.createElement("div");
      overlay.id = "mk-bot-guard";
      overlay.innerHTML = `
        <div class="mk-guard-card">
          <h2>Güvenlik Kontrolü</h2>
          <p>${hardBlock ? "Bu ziyaret otomatik trafik gibi görünüyor." : "Devam etmek için kısa güvenlik kontrolünü tamamlayın."}</p>
          ${hardBlock ? "" : "<button id='mk-guard-btn'>Siteye Devam Et</button>"}
        </div>
      `;

      document.body.appendChild(overlay);

      const btn = document.getElementById("mk-guard-btn");
      if (btn) {
        btn.addEventListener("click", approve);
      }
    }

    document.addEventListener("DOMContentLoaded", function () {
      if (score >= 4) {
        showChallenge(true);
      } else if (score >= 2) {
        showChallenge(false);
      }
    });
  } catch (e) {
    console.warn("Bot guard skipped:", e);
  }
})();
