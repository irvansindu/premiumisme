import { store } from './data.js';

// Configuration
const ADMIN_PASSWORD = 'admin'; // For demo purposes

// State
let currentSection = 'landing';
let isAuthenticated = false;

// DOM Elements
const loginOverlay = document.getElementById('login-overlay');
const loginBtn = document.getElementById('login-btn');
const passwordInput = document.getElementById('admin-password');
const loginError = document.getElementById('login-error');
const dashboard = document.getElementById('admin-dashboard');

const sectionTitle = document.getElementById('section-title');
const editorContainer = document.getElementById('editor-container');
const navItems = document.querySelectorAll('.nav-item');

const exportBtn = document.getElementById('export-btn');
const saveBtn = document.getElementById('save-btn');
const logoutBtn = document.getElementById('logout-btn');
const resetBtn = document.getElementById('reset-btn');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await store.init();
  
  // Check if already logged in (session storage)
  if (sessionStorage.getItem('premiumisme_admin_auth') === 'true') {
    authenticate();
  }

  setupEventListeners();
});

function setupEventListeners() {
  loginBtn.addEventListener('click', handleLogin);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      currentSection = item.dataset.section;
      renderEditor();

      // Close sidebar on mobile after clicking
      if (window.innerWidth <= 768) {
        document.body.classList.remove('sidebar-open');
      }
    });
  });

  // Mobile Navigation
  const menuToggle = document.getElementById('menu-toggle');
  const closeSidebar = document.getElementById('close-sidebar');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      document.body.classList.add('sidebar-open');
    });
  }

  if (closeSidebar) {
    closeSidebar.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
    });
  }

  saveBtn.addEventListener('click', handleSave);
  exportBtn.addEventListener('click', handleExportJSON);
  logoutBtn.addEventListener('click', handleLogout);
  resetBtn.addEventListener('click', handleReset);
}

function handleLogin() {
  if (passwordInput.value === ADMIN_PASSWORD) {
    authenticate();
  } else {
    loginError.textContent = 'Password salah!';
    passwordInput.value = '';
  }
}

function authenticate() {
  isAuthenticated = true;
  sessionStorage.setItem('premiumisme_admin_auth', 'true');
  loginOverlay.style.display = 'none';
  dashboard.style.display = 'flex';
  updateSidebarBranding();
  renderEditor();
}

function updateSidebarBranding() {
  const landingData = store.get('landing');
  const logoBox = document.getElementById('admin-logo-box');
  const brandName = document.getElementById('admin-brand-name');
  
  if (brandName) brandName.textContent = `${landingData.brandName} Admin`;
  if (logoBox) {
    if (landingData.logo) {
      logoBox.innerHTML = `<img src="${landingData.logo}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">`;
    } else {
      logoBox.innerHTML = landingData.avatarText || 'P';
    }
  }
}

function handleLogout() {
  isAuthenticated = false;
  sessionStorage.removeItem('premiumisme_admin_auth');
  loginOverlay.style.display = 'flex';
  dashboard.style.display = 'none';
  passwordInput.value = '';
}

function handleReset() {
  if (confirm('Apakah Anda yakin ingin mereset SEMUA data ke pengaturan awal?')) {
    store.reset();
  }
}

function renderEditor() {
  sectionTitle.textContent = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
  editorContainer.innerHTML = '';

  const data = store.get(currentSection);
  
  if (currentSection === 'landing') {
    renderLandingEditor(data);
  } else if (currentSection === 'store') {
    renderStoreEditor(data);
  } else if (currentSection === 'faq') {
    renderFAQEditor(data);
  } else if (currentSection === 'warranty') {
    renderWarrantyEditor(data);
  } else if (currentSection === 'reseller') {
    renderResellerEditor(data);
  } else if (currentSection === 'config') {
    renderConfigEditor(data);
  }
}

// --- Specific Editors ---

// --- Helpers for User-Friendly Editing ---
function parseDescriptionHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  const strong = div.querySelector('strong');
  const summaryText = strong ? strong.innerText : '';
  
  // Get paragraph if exists after strong
  const p = div.querySelector('p');
  const pText = p ? p.innerText : '';
  
  const features = Array.from(div.querySelectorAll('li')).map(li => li.innerText);
  
  return {
    summary: summaryText + (pText ? ' ' + pText : ''),
    features: features
  };
}

function generateDescriptionHTML(summary, features) {
  if (!summary && features.length === 0) return '';
  let html = `<strong>${summary}</strong>`;
  if (features.length > 0) {
    html += `<ul class="detail-features">`;
    features.forEach(f => {
      if (f.trim()) html += `<li>${f}</li>`;
    });
    html += `</ul>`;
  }
  return html;
}

// --- Image Processing with Canvas (Auto-Crop) ---
function processImage(file, targetWidth, targetHeight) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        // Center Crop Logic
        const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
        const x = (targetWidth - img.width * scale) / 2;
        const y = (targetHeight - img.height * scale) / 2;

        ctx.fillStyle = '#1e293b'; // Fallback bg
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // Quality optimization to save localStorage space
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => reject('Failed to load image');
      img.src = e.target.result;
    };
    reader.onerror = () => reject('Failed to read file');
    reader.readAsDataURL(file);
  });
}

// --- Specific Editors ---

function renderLandingEditor(data) {
  editorContainer.innerHTML = `
    <div class="editor-section">
      <h3>Profile Section</h3>
      <div class="form-group">
        <label>Logo / Brand Image (Auto-crop 400x400 Square)</label>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div class="img-preview landing-logo-preview" style="background: ${data.logo ? `url(${data.logo}) center/cover` : 'rgba(0,0,0,0.2)'}">${!data.logo ? (data.avatarText || 'Logo') : ''}</div>
          <input type="file" id="landing-logo-upload" class="p-upload" accept="image/*" />
          <input type="hidden" id="landing-logo-data" value="${data.logo || ''}" />
        </div>
      </div>
      <div class="form-group">
        <label>Avatar Initial (Fallback)</label>
        <input type="text" id="landing-avatar" value="${data.avatarText}" />
      </div>
      <div class="form-group">
        <label>Brand Name</label>
        <input type="text" id="landing-brand" value="${data.brandName}" />
      </div>
      <div class="form-group">
        <label>Tagline</label>
        <input type="text" id="landing-tagline" value="${data.tagline}" />
      </div>

      <h3 style="margin-top: 2rem;">Social Links</h3>
      <div class="form-group">
        <label>Instagram URL</label>
        <input type="text" id="social-instagram" value="${data.socials.find(s => s.id === 'instagram')?.url || ''}" placeholder="https://instagram.com/yourprofile" />
      </div>
      <div class="form-group">
        <label>Telegram URL</label>
        <input type="text" id="social-telegram" value="${data.socials.find(s => s.id === 'telegram')?.url || ''}" placeholder="https://t.me/yourusername" />
      </div>
      <div class="form-group">
        <label>YouTube URL</label>
        <input type="text" id="social-youtube" value="${data.socials.find(s => s.id === 'youtube')?.url || ''}" placeholder="https://youtube.com/@yourchannel" />
      </div>
    </div>
    <div class="editor-section">
      <h3>Link Buttons</h3>
      <div id="landing-links" class="item-list">
        ${data.links.map((link, i) => `
          <div class="item-row" data-index="${i}">
            <input type="text" placeholder="Text" value="${link.text}" />
            <input type="text" placeholder="URL" value="${link.url}" />
            <input type="text" placeholder="Icon" value="${link.icon}" />
            <button class="btn-remove">×</button>
          </div>
        `).join('')}
      </div>
      <button class="btn-add" data-list="landing-links">+ Add Link</button>
    </div>
  `;
}

function renderStoreEditor(data) {
  editorContainer.innerHTML = `
    <div class="editor-section">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem;">
        <h3>Store Content</h3>
      </div>
      
      <div class="sub-section" style="margin-bottom: 3rem; background: rgba(239, 68, 68, 0.1); padding: 1.5rem; border-radius: 1rem; border: 1px solid rgba(239, 68, 68, 0.2);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="margin:0; color: #ef4444;">⚡ Flash Sale (FOMO)</h4>
          <label style="display:flex; align-items:center; gap:0.5rem; font-weight:bold;">
            <input type="checkbox" id="fs-active" ${data.flashSale?.active ? 'checked' : ''} style="width:1.2rem; height:1.2rem; cursor:pointer;" />
            Aktifkan Promo
          </label>
        </div>
        <div style="margin-top: 1rem; display:flex; gap: 1rem; flex-wrap: wrap;">
          <div class="form-group" style="flex:1; min-width: 250px;">
            <label style="color:#fca5a5;">Teks Judul Promo</label>
            <input type="text" id="fs-title" value="${data.flashSale?.title || ''}" placeholder="Misal: Promo Lebaran Berakhir Dalam..." />
          </div>
          <div class="form-group" style="flex:1; min-width: 200px;">
            <label style="color:#fca5a5;">Waktu Berakhir</label>
            <input type="datetime-local" id="fs-end" value="${data.flashSale?.endDate || ''}" />
          </div>
        </div>
      </div>

      <div class="sub-section" style="margin-bottom: 3rem;">
        <h4>🏷️ Categories</h4>
        <div id="store-categories" class="item-list">
          ${data.categories.map((c, i) => `
            <div class="item-row" data-index="${i}">
              <input type="text" placeholder="Name (e.g. Desain)" value="${c.name}" class="c-name" ${c.id === 'all' ? 'readonly' : ''} />
              <input type="text" placeholder="Slug (e.g. desain)" value="${c.id}" class="c-id" ${c.id === 'all' ? 'readonly' : ''} />
              ${c.id !== 'all' ? '<button class="btn-remove">×</button>' : '<span style="width: 32px; text-align:center; color: var(--text-muted);">🔒</span>'}
            </div>
          `).join('')}
        </div>
        <button class="btn-add" data-list="store-categories">+ Add Category</button>
      </div>

      <div class="sub-section" style="margin-bottom: 3rem;">
        <h4>🖼️ Banners</h4>
        <div id="store-banners" class="item-list">
          ${data.banners.map((b, i) => `
            <div class="item-block" data-index="${i}">
              <div class="item-row">
                <input type="text" placeholder="Title" value="${b.title}" class="b-title" />
                <input type="text" placeholder="Subtitle" value="${b.subtitle}" class="b-subtitle" />
                <button class="btn-remove">×</button>
              </div>
              <div class="item-details">
                <div class="form-group">
                  <label>Banner Image (Auto-crop 1200x450)</label>
                  <div style="display: flex; gap: 1rem; align-items: center;">
                    <div class="img-preview banner-preview" style="background: ${b.image ? `url(${b.image}) center/cover` : b.bg}">${!b.image ? 'No Img' : ''}</div>
                    <input type="file" class="b-upload" accept="image/*" />
                    <input type="hidden" class="b-image-data" value="${b.image || ''}" />
                    <input type="text" placeholder="Fallback BG (CSS)" value="${b.bg}" class="b-bg" />
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="btn-add" data-list="store-banners">+ Add Banner</button>
      </div>

      <div class="sub-section" style="margin-bottom: 3rem;">
        <h4>📦 Products</h4>
        <div id="store-products" class="item-list">
          ${data.products.map((p, i) => {
            const desc = parseDescriptionHTML(p.description || '');
            return `
            <div class="item-block" data-index="${i}">
              <div class="item-row">
                <input type="text" placeholder="Name" value="${p.name}" class="p-name" />
                <select class="p-category">
                  ${store.get('store.categories').map(c => `<option value="${c.id}" ${p.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
                <input type="text" placeholder="Icon (Initial)" value="${p.icon}" class="p-icon" />
                <input type="text" placeholder="Badge" value="${p.badge || ''}" class="p-badge" />
                <button class="btn-remove">×</button>
              </div>
              <div class="item-details">
                <div class="form-group">
                  <label>Product Image (Auto-crop 400x400 Square)</label>
                  <div style="display: flex; gap: 1rem; align-items: center;">
                    <div class="img-preview product-preview" style="background: ${p.image ? `url(${p.image}) center/cover` : 'rgba(0,0,0,0.2)'}">${!p.image ? (p.icon || 'Img') : ''}</div>
                    <input type="file" class="p-upload" accept="image/*" />
                    <input type="hidden" class="p-image-data" value="${p.image || ''}" />
                  </div>
                </div>
                <div class="form-group p-summary-editor">
                  <label>Product Summary (Bold Title)</label>
                  <input type="text" placeholder="e.g. Canva Pro Member" value="${desc.summary}" class="p-summary" />
                </div>
                
                <div class="form-group">
                  <label>Features (List)</label>
                  <div class="feature-list" data-product="${i}">
                    ${desc.features.map(f => `
                      <div class="feature-row">
                        <input type="text" placeholder="Feature..." value="${f}" />
                        <button class="btn-remove btn-remove-sm">×</button>
                      </div>
                    `).join('')}
                  </div>
                  <button class="btn-add-nested" data-type="feature">+ Add Feature</button>
                </div>

                <div class="p-variants-editor">
                  <label>Price Variants</label>
                  <div class="variant-list" data-product="${i}">
                    ${(p.variants || []).map(v => `
                      <div class="variant-row">
                        <input type="text" placeholder="Name (e.g. 1 Bulan)" value="${v.name}" class="v-name" />
                        <input type="text" placeholder="Price" value="${v.price}" class="v-price" />
                        <input type="text" placeholder="Orig. Price" value="${v.originalPrice || ''}" class="v-orig" />
                        <input type="text" placeholder="Disc." value="${v.discount || ''}" class="v-disc" />
                        <select class="v-status">
                          <option value="available" ${v.status === 'available' ? 'selected' : ''}>Tersedia</option>
                          <option value="habis" ${v.status === 'habis' ? 'selected' : ''}>Habis</option>
                        </select>
                        <button class="btn-remove btn-remove-sm">×</button>
                      </div>
                    `).join('')}
                  </div>
                  <button class="btn-add-nested" data-type="variant">+ Add Variant</button>
                </div>
              </div>
            </div>
          `}).join('')}
        </div>
        <button class="btn-add" data-list="store-products">+ Add Product</button>
      </div>

      <div class="sub-section">
        <h4>📋 Articles</h4>
        <div id="store-articles" class="item-list">
          ${data.articles.map((a, i) => `
            <div class="item-block" data-index="${i}">
              <div class="item-row">
                <input type="text" placeholder="Title" value="${a.title}" class="a-title" />
                <input type="text" placeholder="URL (Action Link)" value="${a.url}" class="a-url" />
                <button class="btn-remove">×</button>
              </div>
              <div class="item-details">
                <div class="form-group">
                  <label>Article Cover (Auto-crop 600x400)</label>
                  <div style="display: flex; gap: 1rem; align-items: center;">
                    <div class="img-preview article-preview" style="background: ${a.image ? `url(${a.image}) center/cover` : a.bg}">${!a.image ? 'No Img' : ''}</div>
                    <input type="file" class="a-upload" accept="image/*" />
                    <input type="hidden" class="a-image-data" value="${a.image || ''}" />
                    <input type="text" placeholder="Fallback BG (CSS)" value="${a.bg || 'linear-gradient(135deg, #4f46e5, #ec4899)'}" class="a-bg" />
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="btn-add" data-list="store-articles">+ Add Article</button>
      </div>
    </div>
  `;
}

function renderFAQEditor(data) {
  editorContainer.innerHTML = `
    <div class="editor-section">
      <h3>FAQ Items</h3>
      <div id="faq-items" class="item-list">
        ${data.map((item, i) => `
          <div class="item-block" data-index="${i}">
            <div class="form-group">
              <label>Question</label>
              <input type="text" placeholder="Question" value="${item.question}" class="f-question" />
            </div>
            <div class="form-group">
              <label>Answer (Plain Text)</label>
              <textarea placeholder="Answer..." class="f-answer">${item.answer.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, "")}</textarea>
            </div>
            <button class="btn-remove">×</button>
          </div>
        `).join('')}
      </div>
      <button class="btn-add" data-list="faq-items">+ Add FAQ</button>
    </div>
  `;
}

function renderWarrantyEditor(data) {
  editorContainer.innerHTML = `
    <div class="editor-section">
      <h3>Warranty Content</h3>
      <div id="warranty-items" class="item-list">
         ${data.map((item, i) => {
           const parsed = parseDescriptionHTML(item.content);
           return `
            <div class="item-block" data-index="${i}">
              <div class="form-group">
                <label>Product Name</label>
                <input type="text" placeholder="Product Name" value="${item.name}" class="w-name" />
              </div>
              <div class="form-group">
                <label>Terms & Conditions (List)</label>
                <div class="feature-list" data-warranty="${i}">
                  ${parsed.features.map(f => `
                    <div class="feature-row">
                      <input type="text" placeholder="Term..." value="${f}" />
                      <button class="btn-remove btn-remove-sm">×</button>
                    </div>
                  `).join('')}
                </div>
                <button class="btn-add-nested" data-type="feature">+ Add Term</button>
              </div>
              <button class="btn-remove">×</button>
            </div>
          `}).join('')}
      </div>
      <button class="btn-add" data-list="warranty-items">+ Add Warranty</button>
    </div>
  `;
}

function renderResellerEditor(data) {
   editorContainer.innerHTML = `
    <div class="editor-section">
      <h3>Hero Section</h3>
      <div class="form-group">
        <label>Hero Title</label>
        <input type="text" id="reseller-hero-title" value="${data.hero.title}" />
      </div>
      <div class="form-group">
        <label>Hero Subtitle</label>
        <textarea id="reseller-hero-subtitle">${data.hero.subtitle}</textarea>
      </div>
    </div>
    <div class="editor-section">
      <h3>Profit Calculation Box</h3>
      <div class="form-group">
        <label>Harga Beli (BOT)</label>
        <input type="text" id="reseller-buy" value="${data.profit.buyPrice}" />
      </div>
      <div class="form-group">
        <label>Harga Jual</label>
        <input type="text" id="reseller-sell" value="${data.profit.sellPrice}" />
      </div>
      <div class="form-group">
        <label>Keuntungan</label>
        <input type="text" id="reseller-result" value="${data.profit.result}" />
      </div>
    </div>
  `;
}

function renderConfigEditor(data) {
  editorContainer.innerHTML = `
    <div class="editor-section">
      <h3>Global Configuration</h3>
      <div class="form-group">
        <label>Telegram Bot URL</label>
        <input type="text" id="config-bot-url" value="${data.botUrl}" />
      </div>
      <div class="form-group">
        <label>WhatsApp Number (Digits only)</label>
        <input type="text" id="config-wa-num" value="${data.whatsappNumber}" />
      </div>
      <div class="form-group">
        <label>Contact Email</label>
        <input type="text" id="config-email" value="${data.email}" />
      </div>
    </div>
  `;
}

async function handleSave() {
  const saveBtn = document.getElementById('save-btn');
  const originalText = saveBtn.textContent;
  saveBtn.textContent = 'Menyimpan ke Cloud...';
  saveBtn.disabled = true;

  const updatedData = {};
  // ... (rest of the logic remains same until store.save)

  if (currentSection === 'landing') {
    updatedData.landing = {
      ...store.get('landing'),
      logo: document.getElementById('landing-logo-data').value,
      avatarText: document.getElementById('landing-avatar').value,
      brandName: document.getElementById('landing-brand').value,
      tagline: document.getElementById('landing-tagline').value,
      socials: [
        { id: "instagram", title: "Instagram", url: document.getElementById('social-instagram').value, iconType: "instagram" },
        { id: "telegram", title: "Telegram", url: document.getElementById('social-telegram').value, iconType: "telegram" },
        { id: "youtube", title: "YouTube", url: document.getElementById('social-youtube').value, iconType: "youtube" }
      ],
      links: Array.from(document.querySelectorAll('#landing-links .item-row')).map(row => {
        const inputs = row.querySelectorAll('input');
        return { text: inputs[0].value, url: inputs[1].value, icon: inputs[2].value, internal: inputs[1].value.startsWith('/') };
      })
    };
  } else if (currentSection === 'store') {
    updatedData.store = {
      ...store.get('store'),
      flashSale: {
        active: document.getElementById('fs-active').checked,
        title: document.getElementById('fs-title').value,
        endDate: document.getElementById('fs-end').value
      },
      categories: Array.from(document.querySelectorAll('#store-categories .item-row')).map(row => {
        const idInput = row.querySelector('.c-id').value.trim();
        const nameInput = row.querySelector('.c-name').value.trim();
        return {
          name: nameInput,
          // Auto-generate slug if left empty, else sanitize it
          id: idInput ? idInput.toLowerCase().replace(/\s+/g, '-') : nameInput.toLowerCase().replace(/\s+/g, '-')
        };
      }),
      banners: Array.from(document.querySelectorAll('#store-banners .item-block')).map(block => {
        return {
          title: block.querySelector('.b-title').value,
          subtitle: block.querySelector('.b-subtitle').value,
          image: block.querySelector('.b-image-data').value,
          bg: block.querySelector('.b-bg').value
        };
      }),
      products: Array.from(document.querySelectorAll('#store-products .item-block')).map((block, i) => {
        const nameInput = block.querySelector('.p-name');
        const categorySelect = block.querySelector('.p-category');
        const iconInput = block.querySelector('.p-icon');
        const badgeInput = block.querySelector('.p-badge');
        
        // New structured data
        const summary = block.querySelector('.p-summary').value;
        const features = Array.from(block.querySelectorAll('.feature-list input')).map(inp => inp.value);
        const description = generateDescriptionHTML(summary, features);

        const variants = Array.from(block.querySelectorAll('.variant-row')).map(row => ({
          name: row.querySelector('.v-name').value,
          price: row.querySelector('.v-price').value,
          originalPrice: row.querySelector('.v-orig').value,
          discount: row.querySelector('.v-disc').value,
          status: row.querySelector('.v-status').value
        }));

        const imageData = block.querySelector('.p-image-data').value;

        const existingProducts = store.get('store.products');
        const existing = existingProducts.find(p => p.name === nameInput.value) || {};
        return { 
          ...existing,
          name: nameInput.value, 
          category: categorySelect.value, 
          icon: iconInput.value, 
          badge: badgeInput.value,
          description: description,
          variants: variants,
          image: imageData,
          id: existing.id || nameInput.value.toLowerCase().replace(/\s+/g, '-'),
          bg: existing.bg || 'linear-gradient(135deg, #1e293b, #475569)',
          badgeType: badgeInput.value.toLowerCase().includes('habis') ? 'habis' : (badgeInput.value === '' ? 'none' : 'manual')
        };
      }),
      articles: Array.from(document.querySelectorAll('#store-articles .item-block')).map(block => {
        return {
          title: block.querySelector('.a-title').value,
          bg: block.querySelector('.a-bg').value,
          url: block.querySelector('.a-url').value,
          image: block.querySelector('.a-image-data').value,
          id: Math.random().toString(36).substr(2, 9)
        };
      })
    };
  } else if (currentSection === 'faq') {
    updatedData.faq = Array.from(document.querySelectorAll('#faq-items .item-block')).map((block, i) => {
      const question = block.querySelector('.f-question').value;
      const answer = block.querySelector('.f-answer').value.replace(/\n/g, '<br>');
      return { id: i + 1, question, answer };
    });
  } else if (currentSection === 'warranty') {
     updatedData.warranty = Array.from(document.querySelectorAll('#warranty-items .item-block')).map(block => {
      const name = block.querySelector('.w-name').value;
      const features = Array.from(block.querySelectorAll('.feature-list input')).map(inp => inp.value);
      const content = generateDescriptionHTML(name, features);
      return { id: name.toLowerCase().replace(/\s+/g, '-'), name, content };
    });
  } else if (currentSection === 'reseller') {
    updatedData.reseller = {
      ...store.get('reseller'),
      hero: {
        title: document.getElementById('reseller-hero-title').value,
        subtitle: document.getElementById('reseller-hero-subtitle').value
      },
      profit: {
        buyPrice: document.getElementById('reseller-buy').value,
        sellPrice: document.getElementById('reseller-sell').value,
        result: document.getElementById('reseller-result').value
      }
    };
  } else if (currentSection === 'config') {
    updatedData.config = {
      botUrl: document.getElementById('config-bot-url').value,
      whatsappNumber: document.getElementById('config-wa-num').value,
      email: document.getElementById('config-email').value
    };
  }

  await store.save(updatedData);
  updateSidebarBranding();
  
  saveBtn.textContent = originalText;
  saveBtn.disabled = false;
  alert('Perubahan berhasil disimpan dan sudah LIVE untuk semua orang! 🚀');
}

function handleExportJSON() {
  const data = store.data;
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'premiumisme_data.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  alert('Data berhasil diekspor! Silakan gunakan isi file ini untuk memperbarui INITIAL_DATA di src/data.js agar perubahan permanen saat pindah hosting.');
}

// Add/Remove logic using delegation
editorContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-remove')) {
    // Remove the whole item-block if inside one, otherwise remove direct parent
    const block = e.target.closest('.item-block');
    if (block) {
      block.remove();
    } else {
      e.target.parentElement.remove();
    }
  } else if (e.target.classList.contains('btn-add')) {
    const listId = e.target.dataset.list;
    const list = document.getElementById(listId);
    if (!list) return;

    const row = document.createElement('div');

    if (listId === 'landing-links') {
      row.className = 'item-row';
      row.innerHTML = `<input type="text" placeholder="Text" /><input type="text" placeholder="URL" /><input type="text" placeholder="Icon" /><button class="btn-remove">×</button>`;
    } else if (listId === 'store-categories') {
      row.className = 'item-row';
      row.innerHTML = `
        <input type="text" placeholder="Name" class="c-name" />
        <input type="text" placeholder="Slug (auto)" class="c-id" />
        <button class="btn-remove">×</button>
      `;
    } else if (listId === 'store-products') {
      row.className = 'item-block';
      row.innerHTML = `
        <div class="item-row">
          <input type="text" placeholder="Name" class="p-name" />
          <select class="p-category">
            ${store.get('store.categories').map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
          <input type="text" placeholder="Icon" class="p-icon" />
          <input type="text" placeholder="Badge" class="p-badge" />
          <button class="btn-remove">×</button>
        </div>
        <div class="item-details">
          <div class="form-group p-summary-editor">
            <label>Product Summary (Bold Title)</label>
            <input type="text" placeholder="e.g. Canva Pro Member" class="p-summary" />
          </div>
          <div class="form-group">
            <label>Features (List)</label>
            <div class="feature-list"></div>
            <button class="btn-add-nested" data-type="feature">+ Add Feature</button>
          </div>
          <div class="p-variants-editor">
            <label>Price Variants</label>
            <div class="variant-list"></div>
            <button class="btn-add-nested" data-type="variant">+ Add Variant</button>
          </div>
        </div>
      `;
    } else if (listId === 'store-banners') {
      row.className = 'item-block';
      row.innerHTML = `
        <div class="item-row">
          <input type="text" placeholder="Title" class="b-title" />
          <input type="text" placeholder="Subtitle" class="b-subtitle" />
          <button class="btn-remove">×</button>
        </div>
        <div class="item-details">
          <div class="form-group">
            <label>Banner Image (Auto-crop 1200x450)</label>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <div class="img-preview banner-preview" style="background: linear-gradient(135deg, #4f46e5, #ec4899)">No Img</div>
              <input type="file" class="b-upload" accept="image/*" />
              <input type="hidden" class="b-image-data" value="" />
              <input type="text" placeholder="Fallback BG (CSS)" value="linear-gradient(135deg, #4f46e5, #ec4899)" class="b-bg" />
            </div>
          </div>
        </div>
      `;
    } else if (listId === 'store-articles') {
      row.className = 'item-block';
      row.innerHTML = `
        <div class="item-row">
          <input type="text" placeholder="Title" class="a-title" />
          <input type="text" placeholder="URL" class="a-url" />
          <button class="btn-remove">×</button>
        </div>
        <div class="item-details">
          <div class="form-group">
            <label>Article Cover (Auto-crop 600x400)</label>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <div class="img-preview article-preview" style="background: linear-gradient(135deg, #4f46e5, #ec4899)">No Img</div>
              <input type="file" class="a-upload" accept="image/*" />
              <input type="hidden" class="a-image-data" value="" />
              <input type="text" placeholder="Fallback BG (CSS)" value="linear-gradient(135deg, #4f46e5, #ec4899)" class="a-bg" />
            </div>
          </div>
        </div>
      `;
    } else if (listId === 'faq-items') {
      row.className = 'item-block';
      row.innerHTML = `
        <div class="form-group">
          <label>Question</label>
          <input type="text" placeholder="Question" class="f-question" />
        </div>
        <div class="form-group">
          <label>Answer (Plain Text)</label>
          <textarea placeholder="Answer..." class="f-answer"></textarea>
        </div>
        <button class="btn-remove">×</button>
      `;
    } else if (listId === 'warranty-items') {
      row.className = 'item-block';
      row.innerHTML = `
        <div class="form-group">
          <label>Product Name</label>
          <input type="text" placeholder="Product Name" class="w-name" />
        </div>
        <div class="form-group">
          <label>Terms & Conditions (List)</label>
          <div class="feature-list"></div>
          <button class="btn-add-nested" data-type="feature">+ Add Term</button>
        </div>
        <button class="btn-remove">×</button>
      `;
    }
    
    list.appendChild(row);
  } else if (e.target.classList.contains('btn-add-nested')) {
    const type = e.target.dataset.type;
    const list = e.target.previousElementSibling;
    const row = document.createElement('div');
    
    if (type === 'feature') {
      row.className = 'feature-row';
      row.innerHTML = `
        <input type="text" placeholder="New point..." />
        <button class="btn-remove btn-remove-sm">×</button>
      `;
    } else if (type === 'variant') {
      row.className = 'variant-row';
      row.innerHTML = `
        <input type="text" placeholder="Name" class="v-name" />
        <input type="text" placeholder="Price" class="v-price" />
        <input type="text" placeholder="Orig. Price" class="v-orig" />
        <input type="text" placeholder="Disc." class="v-disc" />
        <select class="v-status">
          <option value="available">Tersedia</option>
          <option value="habis">Habis</option>
        </select>
        <button class="btn-remove btn-remove-sm">×</button>
      `;
    }
    list.appendChild(row);
  }
});

// --- Image Upload Interaction ---
editorContainer.addEventListener('change', async (e) => {
  if (e.target.classList.contains('p-upload') || e.target.classList.contains('b-upload') || e.target.classList.contains('a-upload')) {
    const file = e.target.files[0];
    if (!file) return;

    let targetW = 400;
    let targetH = 400;
    
    if (e.target.classList.contains('b-upload')) {
      targetW = 1200;
      targetH = 450;
    } else if (e.target.classList.contains('a-upload')) {
      targetW = 600;
      targetH = 400;
    }
    
    const preview = e.target.parentElement.querySelector('.img-preview');
    const hiddenInput = e.target.parentElement.querySelector('input[type="hidden"]');
    
    preview.innerText = 'Processing...';
    
    try {
      const base64 = await processImage(file, targetW, targetH);
      hiddenInput.value = base64;
      preview.innerText = '';
      preview.style.backgroundImage = `url(${base64})`;
      preview.style.backgroundSize = 'cover';
    } catch (err) {
      console.error(err);
      preview.innerText = 'Error';
    }
  }
});
