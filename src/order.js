import { store } from './data.js';
import { updateGlobalBranding } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
  await store.init();
  renderOrderPage();
  updateGlobalBranding();
});

function renderOrderPage() {
  const config = store.get('config');
  
  // Update Bot Link
  const botBtn = document.getElementById('bot-order-btn');
  if (botBtn && config.botUrl) {
    botBtn.href = config.botUrl;
  }

  // Render Tutorials (Mocked in INITIAL_DATA for now or could be expanded)
  const container = document.getElementById('tutorial-container');
  if (container) {
    // Default tutorials if not in store
    const tutorials = [
      {
        title: "Order via Bot Telegram",
        icon: "📦",
        highlight: "Order via Bot",
        steps: [
          "Klik tombol \"Order via Bot\" di atas",
          "Pilih produk dan jumlah yang diinginkan",
          "Lakukan pembayaran sesuai instruksi",
          "Produk akan dikirim otomatis"
        ],
        videoUrl: "https://youtube.com/shorts/lMqLaIZJT04"
      },
      {
        title: "Order via Webstore",
        icon: "🛍️",
        highlight: "Order via Webstore",
        steps: [
          "Klik tombol \"Order via Webstore\" di atas",
          "Pilih produk dan tambahkan ke keranjang",
          "Lakukan pembayaran sesuai instruksi",
          "Produk langsung siap digunakan"
        ],
        videoUrl: "https://youtube.com/shorts/MzHNUj2cuyQ"
      }
    ];

    container.innerHTML = tutorials.map(t => `
      <div class="tutorial-card">
        <h2 class="tutorial-title"><span class="icon">${t.icon}</span> ${t.title}</h2>
        <ul class="tutorial-steps">
          ${t.steps.map(s => `<li><span class="arrow">→</span> ${s.replace(t.highlight, `<span class="highlight">${t.highlight}</span>`)}</li>`).join('')}
        </ul>
        <a href="${t.videoUrl}" target="_blank" rel="noopener" class="video-btn">
          <span class="yt-icon">▶</span> Tonton Video Tutorial
        </a>
      </div>
    `).join('');
  }
}
