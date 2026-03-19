import { store } from './data.js';
import { updateGlobalBranding } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
  await store.init();
  updateGlobalBranding();
  const urlParams = new URLSearchParams(window.location.search);
  const productSlug = urlParams.get('p');

  if (productSlug) {
    renderProductDetail(productSlug);
  } else {
    window.location.href = '/store.html';
  }
});

function renderProductDetail(slug) {
  const products = store.get('store.products');
  const product = products.find(p => p.id === slug);

  if (!product) {
    document.getElementById('product-detail-container').innerHTML = `
      <div style="text-align: center; padding: 5rem;">
        <h2>Produk tidak ditemukan</h2>
        <a href="/store.html" class="btn-login" style="display: inline-block; margin-top: 1rem;">Kembali ke Store</a>
      </div>
    `;
    return;
  }

  // Update Breadcrumb
  document.getElementById('breadcrumb-product-name').textContent = product.name;
  document.title = `${product.name} - Premiumisme`;

  const container = document.getElementById('product-detail-container');
  container.innerHTML = `
    <div class="product-detail-layout">
      <!-- Product Image -->
      <div class="product-detail-image">
        ${product.image 
          ? `<img src="${product.image}" alt="${product.name}" class="detail-img-fluid" style="width:100%; height:100%; object-fit:cover; border-radius:1.5rem;">`
          : `<div class="detail-icon" style="background: ${product.bg}">${product.icon}</div>`
        }
      </div>

      <!-- Product Info -->
      <div class="product-detail-info">
        <div class="detail-header">
          <h1 class="detail-title">${product.name}</h1>
          <div class="detail-badges">
            <span class="detail-badge badge-cat">${product.category.toUpperCase()}</span>
            <span class="detail-badge badge-views">👁 ${product.stats?.views || 0}</span>
            <span class="detail-badge badge-downloads">⬇ ${product.stats?.downloads || 0}</span>
            <span class="detail-badge badge-share">↗ Share</span>
          </div>
        </div>

        <div class="detail-description">
          <div class="description-preview">
            ${product.description || 'Deskripsi produk belum tersedia.'}
          </div>
          ${product.features ? `
            <div id="more-content" style="display:none;">
              <ul class="detail-features">
                ${product.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>
            <button class="show-more-btn" id="show-more-btn">Lihat selengkapnya..</button>
          ` : ''}
        </div>

        <!-- Login Warning -->
        <div class="login-warning">
          ⚠️ Kamu belum login, jumlah pembelian akan dibatasi. Silahkan <a href="#">Login</a> terlebih dahulu.
        </div>

        <!-- Tab Switcher -->
        <div class="tab-switcher">
          <button class="tab-btn active" data-tab="tab-variants">✨ Variants</button>
          <button class="tab-btn" data-tab="tab-reviews">⭐ Reviews</button>
        </div>

        <!-- Variants Tab -->
        <div class="tab-content active" id="tab-variants">
          <p class="variants-label">Choose your needs</p>
          <div class="variants-grid">
            ${(product.variants || []).length > 0 ? product.variants.map(v => `
              <div class="variant-card ${v.status === 'out-of-stock' ? 'disabled' : ''}" 
                   data-name="${v.name}" 
                   data-price="${v.price}">
                <div class="variant-name">${v.name}</div>
                <div class="variant-status ${v.status}">
                  ${v.status === 'available' ? '✨ TERSEDIA' : '⚡ HABIS'}
                </div>
                <div class="variant-pricing">
                  <span class="variant-price">Rp. ${v.price}</span>
                  ${v.originalPrice ? `<span class="variant-original">Rp. ${v.originalPrice}</span>` : ''}
                  ${v.discount ? `<span class="variant-discount">🏷 ${v.discount}</span>` : ''}
                </div>
              </div>
            `).join('') : '<p style="color: var(--text-muted);">Varian belum tersedia.</p>'}
          </div>
        </div>

        <!-- Reviews Tab -->
        <div class="tab-content" id="tab-reviews">
          <div class="reviews-list">
            ${(product.reviews || []).length > 0 ? product.reviews.map(r => `
              <div class="review-card">
                <div class="review-header">
                  <span class="review-user">${r.user}</span>
                  <span class="review-stars">${'⭐'.repeat(r.stars)}</span>
                </div>
                <p class="review-text">${r.text}</p>
                <p class="review-date">${r.date}</p>
              </div>
            `).join('') : '<p style="color: var(--text-muted);">Belum ada ulasan.</p>'}
          </div>
        </div>
      </div>
    </div>
  `;

  setupTabHandlers();
  setupShowMoreHandler();
  setupVariantHandlers(product.name);
  renderRelatedProducts(product.category, product.id);
}

function setupVariantHandlers(productName) {
  const variants = document.querySelectorAll('.variant-card:not(.disabled)');
  const config = store.get('config');

  variants.forEach(card => {
    card.addEventListener('click', () => {
      const variantName = card.dataset.name;
      const price = card.dataset.price;
      const waNum = config.whatsappNumber || '6289633011300';
      
      const message = `Halo Admin, saya ingin order ${productName} paket ${variantName} dengan harga Rp ${price}. Mohon prosesnya.`;
      const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(message)}`;
      
      window.open(waUrl, '_blank');
    });
  });
}

function setupTabHandlers() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

function setupShowMoreHandler() {
  const btn = document.getElementById('show-more-btn');
  const more = document.getElementById('more-content');
  if (btn && more) {
    btn.addEventListener('click', () => {
      if (more.style.display === 'none') {
        more.style.display = 'block';
        btn.textContent = 'Lihat sesedikit..';
      } else {
        more.style.display = 'none';
        btn.textContent = 'Lihat selengkapnya..';
      }
    });
  }
}

function renderRelatedProducts(category, currentId) {
  const products = store.get('store.products');
  const related = products.filter(p => p.category === category && p.id !== currentId).slice(0, 4);
  
  const grid = document.getElementById('related-products-grid');
  if (grid) {
    grid.innerHTML = related.map(p => `
      <div class="product-card" data-slug="${p.id}">
        <div class="product-img">
          <div class="product-icon" style="background: ${p.bg}">${p.icon}</div>
        </div>
        <div class="product-badge badge-${p.badgeType || 'manual'}">${p.badge || 'PROSES MANUAL'}</div>
        <div class="product-info">
          <div class="product-category">${p.category.toUpperCase()}</div>
          <div class="product-name">${p.name}</div>
        </div>
      </div>
    `).join('');

    // Setup clicks for related products
    grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.href = `/product.html?p=${card.dataset.slug}`;
      });
    });
  }
}
