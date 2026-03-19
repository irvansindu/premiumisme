import { store } from './data.js';

// Inject preloader immediately
injectPreloader();

function injectPreloader() {
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  preloader.className = 'preloader';
  preloader.innerHTML = `
    <div class="preloader-content">
      <div class="preloader-logo" id="preloader-brand">Store</div>
      <div class="preloader-spinner-wrapper">
        <div class="preloader-spinner"></div>
        <div class="preloader-spinner-inner"></div>
      </div>
    </div>
  `;
  document.documentElement.appendChild(preloader);
}

// ===== Global JS: Theme toggle, search modal, scroll-to-top =====
document.addEventListener('DOMContentLoaded', async () => {
  await store.init();
  initTheme();
  initSearch();
  initScrollTop();
  updateGlobalBranding();
  
  // Page-specific rendering
  if (document.getElementById('products-grid')) {
    renderStore();
  }
  
  if (document.getElementById('faq-list')) {
    renderFAQ();
  }

  // Footer categories
  renderFooter();

  setupGlobalAnimations();

  // FINAL STEP: Reveal body after all branding and data is ready
  document.body.classList.add('body-ready');
  
  // Hide Preloader with delay for smoothness
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('preloader-hidden');
      setTimeout(() => preloader.remove(), 600);
    }, 400);
  }
});

function renderFooter() {
  const categories = store.get('store.categories');
  const footerCatList = document.getElementById('footer-categories');
  if (footerCatList && categories) {
    footerCatList.innerHTML = categories.filter(c => c.id !== 'all').map(cat => `
      <li><a href="/store.html?cat=${cat.id}">${cat.name}</a></li>
    `).join('');
  }
}

// --- Theme ---
function initTheme() {
  const savedTheme = localStorage.getItem('premiumisme-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('premiumisme-theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  themeToggle.innerHTML = theme === 'dark'
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

// --- Search ---
function initSearch() {
  const searchOverlay = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-modal-input');
  const searchBarInput = document.getElementById('header-search-input');

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape' && searchOverlay) {
      closeSearchModal();
    }
  });

  if (searchBarInput) {
    searchBarInput.addEventListener('focus', (e) => {
      e.target.blur();
      openSearchModal();
    });
  }

  function openSearchModal() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (searchInput) {
      searchInput.value = '';
      renderSearchResults('');
      setTimeout(() => searchInput.focus(), 100);
    }
  }

  function closeSearchModal() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearchModal();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }
}

function renderSearchResults(query) {
  const resultsContainer = document.getElementById('search-results');
  if (!resultsContainer) return;

  if (!query.trim()) {
    resultsContainer.innerHTML = '<p class="search-empty">Ketik untuk mencari produk...</p>';
    return;
  }

  const products = store.get('store.products');
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  let transactionResult = '';
  if (query.toUpperCase().startsWith('INV-')) {
    transactionResult = `
      <div class="search-result-item transaction-item" data-type="invoice" data-id="${query.toUpperCase()}">
        <div class="result-icon" style="background: var(--accent-color)">📋</div>
        <div class="result-info">
          <div class="result-name">Cek Transaksi "${query.toUpperCase()}"</div>
          <div class="result-cat">TRANSAKSI</div>
        </div>
        <div class="result-arrow">→</div>
      </div>
    `;
  }

  if (filtered.length === 0 && !transactionResult) {
    resultsContainer.innerHTML = '<p class="search-empty">Produk tidak ditemukan.</p>';
    return;
  }

  resultsContainer.innerHTML = transactionResult + filtered.map(p => `
    <div class="search-result-item" data-type="product" data-slug="${p.id}">
      <div class="result-icon" style="background: ${p.bg}">${p.icon}</div>
      <div class="result-info">
        <div class="result-name">${p.name}</div>
        <div class="result-cat">${p.category.toUpperCase()}</div>
      </div>
      <div class="result-arrow">→</div>
    </div>
  `).join('');

  resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      if (item.dataset.type === 'invoice') {
        window.location.href = `/transaction.html?id=${item.dataset.id}`;
      } else {
        window.location.href = `/product.html?p=${item.dataset.slug}`;
      }
    });
  });
}

// --- Scroll Top ---
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) scrollTopBtn.classList.add('visible');
      else scrollTopBtn.classList.remove('visible');
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// --- RENDERING STORE ---
function renderStore() {
  const data = store.get('store');
  
  // Categories
  const catContainer = document.getElementById('category-tabs');
  if (catContainer) {
    catContainer.innerHTML = data.categories.map((cat, i) => `
      <button class="cat-tab ${i === 0 ? 'active' : ''}" data-category="${cat.id}">${cat.name}</button>
    `).join('');
    setupCategoryFilters();
  }

  // Banners
  const bannerContainer = document.getElementById('banner-slider');
  if (bannerContainer) {
    bannerContainer.innerHTML = `
      ${data.banners.map((banner, i) => `
        <div class="banner-slide ${i === 0 ? 'active' : ''}" style="background: ${banner.image ? `url(${banner.image}) center/cover` : banner.bg}">
          <div class="banner-content">
            <h2>${banner.title}</h2>
            <p>${banner.subtitle}</p>
          </div>
        </div>
      `).join('')}
      <div class="banner-dots">
        ${data.banners.map((_, i) => `
          <div class="banner-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></div>
        `).join('')}
      </div>
    `;
    setupBannerSlider();
  }

  // Products
  const productsGrid = document.getElementById('products-grid');
  if (productsGrid) {
    productsGrid.innerHTML = data.products.map(product => `
      <div class="product-card" data-category="${product.category}" data-slug="${product.id}">
        <div class="product-img">
          ${product.image 
            ? `<img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover; border-radius:1.5rem;">`
            : `<div class="product-icon" style="background: ${product.bg}">${product.icon}</div>`
          }
        </div>
        <div class="product-badge badge-${product.badgeType}">${product.badge}</div>
        <div class="product-info">
          <div class="product-category">${product.category.toUpperCase()}</div>
          <div class="product-name">${product.name}</div>
        </div>
      </div>
    `).join('');
    setupProductLinks();
  }

  // Articles
  const articlesGrid = document.getElementById('articles-grid');
  if (articlesGrid) {
    articlesGrid.innerHTML = data.articles.map(article => `
      <a href="${article.url}" class="article-card">
        <div class="article-thumb">
          <div class="article-thumb-bg" style="background: ${article.bg}">
            <div class="article-logo">P</div>
            <h3>${article.title}</h3>
          </div>
        </div>
      </a>
    `).join('');
  }
}

function renderFAQ() {
  const data = store.get('faq');
  const faqList = document.getElementById('faq-list');
  if (faqList) {
    faqList.innerHTML = data.map(item => `
      <div class="accordion-item">
        <button class="accordion-header">
          ${item.question}
          <span class="accordion-icon">▼</span>
        </button>
        <div class="accordion-body">
          <div class="accordion-body-inner">
            ${item.answer}
          </div>
        </div>
      </div>
    `).join('');
    initAccordion();
  }
}

function setupCategoryFilters() {
  const catTabs = document.querySelectorAll('.cat-tab');
  const productCards = document.querySelectorAll('.product-card');
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.category;
      productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function setupBannerSlider() {
  const slides = document.querySelectorAll('.banner-slide');
  const dots = document.querySelectorAll('.banner-dot');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
  }

  if (slides.length > 0) {
    const interval = setInterval(() => {
      if (!document.contains(slides[0])) {
         clearInterval(interval);
         return;
      }
      showSlide((currentSlide + 1) % slides.length);
    }, 4000);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i));
    });
  }
}

function setupProductLinks() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.dataset.slug;
      if (slug) window.location.href = `/product.html?p=${slug}`;
    });
  });
}

function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-body').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

function setupGlobalAnimations() {
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.product-card, .article-card, .warranty-block, .accordion-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

export function updateGlobalBranding() {
  const data = store.get('landing');
  const brandName = data.brandName || "Store";
  const brandNameLower = brandName.toLowerCase().replace(/\s+/g, '');

  // Update preloader brand name if it's still visible
  const preloaderBrand = document.getElementById('preloader-brand');
  if (preloaderBrand) {
    preloaderBrand.textContent = brandName;
  }

  // 1. Update Document Title
  if (document.title.includes('Premiumisme') || document.title === 'Syarat & Ketentuan' || document.title === 'FAQ' || document.title === 'Tutorial Order' || document.title === 'Product Detail' || document.title === 'Cek Status Transaksi' || document.title === 'Program Reseller' || document.title === 'Premium Store') {
    document.title = document.title.replace(/Premiumisme/g, brandName);
    if (!document.title.includes(brandName)) {
       document.title = `${document.title} - ${brandName}`;
    }
  }

  // 2. Update Header & Footer logos and Copyright Brand
  const logos = document.querySelectorAll('.header-logo');
  logos.forEach(el => {
    el.textContent = brandName;
  });

  // 3. Update Meta Description & OG
  const metaTags = document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[property="og:title"]');
  metaTags.forEach(tag => {
    tag.content = tag.content.replace(/Premiumisme/g, brandName);
  });

  // 4. Aggressive Recursive Text Replacement
  // Only if the node contains Premiumisme to avoid unnecessary overhead
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while (node = walk.nextNode()) {
    if (node.nodeValue.includes('Premiumisme')) {
      node.nodeValue = node.nodeValue.replace(/Premiumisme/g, brandName);
    }
  }

  // 5. Update Social Links in Footer
  const footerSocials = document.querySelectorAll('.footer-social-icon');
  footerSocials.forEach(icon => {
    const label = icon.getAttribute('aria-label')?.toLowerCase();
    if (label) {
      if (label === 'whatsapp') {
        const waNum = store.get('config').whatsappNumber;
        icon.href = `https://wa.me/${waNum}`;
      } else {
        const social = data.socials.find(s => s.id === label);
        if (social && social.url) icon.href = social.url;
      }
    }
  });

  // 6. Update Admin Sidebar (if exists)
  const adminBrandName = document.getElementById('admin-brand-name');
  if (adminBrandName) {
    adminBrandName.textContent = `${brandName} Admin`;
  }

  // 7. Update Footer Copyright Year and Name
  const footerTexts = document.querySelectorAll('.footer-text, .footer-bottom p');
  footerTexts.forEach(p => {
    if (p.textContent.includes('©')) {
        const year = new Date().getFullYear();
        p.innerHTML = `© ${year} <span class="header-logo">${brandName}</span>. All rights reserved.`;
    }
  });
}

// Listen for data updates to refresh branding
window.addEventListener('premiumisme-data-updated', () => {
  updateGlobalBranding();
});
