import { store } from './data.js';
import { updateGlobalBranding } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
  await store.init();
  renderReseller();
  updateGlobalBranding();
});

function renderReseller() {
  const data = store.get('reseller');
  if (!data) return;

  // Render Hero
  document.getElementById('hero-title').textContent = data.hero.title;
  document.getElementById('hero-subtitle').textContent = data.hero.subtitle;

  // Render Steps
  const processGrid = document.getElementById('process-grid');
  if (processGrid) {
    const topSteps = data.steps.slice(0, 3);
    const bottomSteps = data.steps.slice(3);

    processGrid.innerHTML = `
      <div class="process-row top-row">
        ${topSteps.map((step, i) => `
          <div class="process-card">
            <div class="card-icon">${getIcon(step.iconType)}</div>
            <h3>${step.title}</h3>
            <p>${step.desc}</p>
          </div>
          ${i < topSteps.length - 1 ? '<div class="arrow-icon">→</div>' : ''}
        `).join('')}
      </div>
      <div class="process-row bottom-row">
        ${bottomSteps.map((step, i) => `
          <div class="process-card ${step.highlight ? 'highlight' : ''}">
            <div class="card-icon">${getIcon(step.iconType)}</div>
            <h3>${step.title}</h3>
            <p>${step.desc}</p>
          </div>
          ${i < bottomSteps.length - 1 ? '<div class="arrow-icon">→</div>' : ''}
        `).join('')}
      </div>
    `;
  }

  // Render Profit Box
  const profitBox = document.getElementById('profit-box');
  if (profitBox) {
    profitBox.innerHTML = `
      <div class="profit-badge">
        <span class="icon">💡</span> Contoh Simpel
      </div>
      <div class="profit-content">
        <p>Kamu order produk A di BOT seharga <strong>Rp${data.profit.buyPrice}</strong></p>
        <p>Jual ke customer seharga <strong>Rp${data.profit.sellPrice}</strong></p>
        <p class="profit-result">Untung: Rp${data.profit.result} langsung!</p>
      </div>
    `;
  }

  // Render Advantages
  const advBox = document.getElementById('advantages-box');
  if (advBox) {
    advBox.innerHTML = `
      <h3 class="adv-title"><span class="icon">⭐</span> Keunggulan Premiumisme:</h3>
      <div class="adv-grid">
        ${data.advantages.map(adv => `
          <div class="adv-item"><span class="check-icon">✔</span> ${adv}</div>
        `).join('')}
      </div>
    `;
  }

  // Render CTA
  const ctaBox = document.getElementById('cta-box');
  if (ctaBox) {
    ctaBox.innerHTML = `
      <h2 class="cta-title"><span class="icon">🚀</span> Siap Mulai Jualan Digital?</h2>
      <p class="cta-subtitle">Langsung akses BOT-nya dan mulai cuan hari ini juga!</p>
      <a href="https://t.me/premiumisme_bot" target="_blank" rel="noopener" class="cta-btn">Akses BOT Sekarang</a>
    `;
  }
}

function getIcon(type) {
  switch (type) {
    case 'store':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 7V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v2H2v2c0 1.66 1.34 3 3 3v8h14v-8c1.66 0 3-1.34 3-3V7h-1zM5 5h14v2H5V5zm14 14H5v-6.03A3.966 3.966 0 016 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2h2c0 .55.45 1 1 1s1-.45 1-1V5h2v6c0 1.1.9 2 2 2s2-.9 2-2V5h2v6c0 .55.45 1 1 1s1-.45 1-1h2c0 1.1-.9 2-2 2s-2-.9-2-2c0 .28.06.55.15.8.52.48 1.22.8 2.05.8.83 0 1.53-.32 2.05-.8.09-.25.15-.52.15-.8h2v11z"/></svg>`;
    case 'bot':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 9h-2V7c0-1.1-.9-2-2-2h-3.51a3.986 3.986 0 00-6.98 0H3c-1.1 0-2 .9-2 2v2H0v5h2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4h2V9h-3zm-4 4c-.83 0-1.5-.67-1.5-1.5S16.17 10 17 10s1.5.67 1.5 1.5S17.83 13 17 13zm-8 0c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm4 4h-2v-2h2v2z"/></svg>`;
    case 'cart':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>`;
    case 'tag':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.36-.36.59-.86.59-1.41s-.23-1.06-.59-1.41zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>`;
    case 'money':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-3.47-1.78-3.47-3.18 0-1.36 1.1-2.48 2.74-2.77V5h2.67v1.85c1.42.3 2.65 1.15 2.89 2.76h-1.95c-.17-.89-.86-1.54-2.27-1.54-1.54 0-2.13.75-2.13 1.43 0 .75.46 1.34 2.58 1.86 2.72.67 3.56 1.82 3.56 3.33 0 1.63-1.14 2.62-2.93 2.94z"/></svg>`;
    default:
      return '';
  }
}
