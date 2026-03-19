import { store } from './data.js';
import { updateGlobalBranding } from './global.js';

// Landing page interactions
document.addEventListener('DOMContentLoaded', async () => {
  await store.init();
  renderLanding();
  updateGlobalBranding();
  setupAnimations();

  // Hide the premium preloader smoothly
  const preloader = document.getElementById('premium-preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 800); // 800ms delay to let the user see the aesthetic loader
  }
});

function renderLanding() {
  const data = store.get('landing');
  
  // Render Profile
  const profileContainer = document.getElementById('profile-container');
  if (profileContainer) {
    const avatarContainer = profileContainer.querySelector('.avatar');
    if (data.logo) {
      avatarContainer.innerHTML = `<img src="${data.logo}" alt="${data.brandName}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">`;
    } else {
      avatarContainer.innerHTML = `<span class="avatar-text">${data.avatarText}</span>`;
    }
    profileContainer.querySelector('.brand-name').textContent = data.brandName;
    profileContainer.querySelector('.tagline').textContent = data.tagline;
  }

  // Render Links
  const linksContainer = document.getElementById('links-container');
  if (linksContainer) {
    linksContainer.innerHTML = data.links.map(link => `
      <a href="${link.url}" class="link-btn" id="link-${link.id}" ${link.internal ? '' : 'target="_blank" rel="noopener"'}>
        <span class="link-icon">${link.icon}</span>
        <span class="link-text">${link.text}</span>
        <span class="link-arrow">→</span>
      </a>
    `).join('');
  }

  // Render Socials
  const socialsContainer = document.getElementById('socials-container');
  if (socialsContainer) {
    socialsContainer.innerHTML = data.socials.map(social => `
      <a href="${social.url}" class="social-icon" title="${social.title}" aria-label="${social.title}">
        ${getSocialIcon(social.iconType)}
      </a>
    `).join('');
  }
}

function getSocialIcon(type) {
  switch (type) {
    case 'instagram':
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`;
    case 'telegram':
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`;
    case 'youtube':
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
    default:
      return '';
  }
}

function setupAnimations() {
  // Staggered entrance animation for link buttons
  const linkBtns = document.querySelectorAll('.link-btn');
  linkBtns.forEach((btn, index) => {
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(20px)';
    setTimeout(() => {
      btn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
    }, 300 + index * 100);

    // Add ripple effect on click
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
      `;

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframes
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleEffect {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Parallax effect on mouse move
  document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 8;
      const moveX = (x - 0.5) * speed;
      const moveY = (y - 0.5) * speed;
      orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });
}
