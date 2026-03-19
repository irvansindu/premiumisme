import { store } from './data.js';
import { updateGlobalBranding } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
  await store.init();
  renderWarranty();
  updateGlobalBranding();
});

function renderWarranty() {
  const data = store.get('warranty');
  const select = document.getElementById('product-select');
  const contentArea = document.getElementById('warranty-content');

  if (select && data) {
    // Keep the default disabled option
    const defaultOption = select.options[0];
    select.innerHTML = '';
    select.appendChild(defaultOption);

    // Add dynamic options
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.name;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      const productId = e.target.value;
      const product = data.find(p => p.id === productId);

      if (!product) return;

      // Update content area with animation
      contentArea.innerHTML = `
        <div class="details-card">
          <div class="details-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h2>Syarat & Ketentuan Produk</h2>
          </div>
          <div class="details-list-content">
            ${product.content}
          </div>
        </div>
      `;
      
      // Trigger animation
      const card = contentArea.querySelector('.details-card');
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.transition = 'all 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      }
    });
  }
}
