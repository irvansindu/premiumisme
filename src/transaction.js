import { store } from './data.js';
import { updateGlobalBranding } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
  await store.init();
  updateGlobalBranding();
  const urlParams = new URLSearchParams(window.location.search);
  const invoiceId = urlParams.get('id');
  
  const input = document.getElementById('invoice-input');
  const btn = document.getElementById('check-btn');
  const resultArea = document.getElementById('result-area');

  if (invoiceId) {
    input.value = invoiceId;
    checkInvoice(invoiceId);
  }

  btn.addEventListener('click', () => {
    const id = input.value.trim();
    if (id) {
      checkInvoice(id);
    }
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const id = input.value.trim();
      if (id) checkInvoice(id);
    }
  });

  function checkInvoice(id) {
    resultArea.style.display = 'block';
    resultArea.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div class="loading-spinner" style="border: 3px solid var(--border-color); border-top: 3px solid var(--accent-color); border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
        <p>Mengecek data...</p>
      </div>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    `;

    // Simulate API delay
    setTimeout(() => {
      const isFound = id.toUpperCase().startsWith('INV-');
      
      if (!isFound) {
        resultArea.innerHTML = `
          <div style="text-align:center;">
             <span class="status-badge status-error">TIDAK DITEMUKAN</span>
             <p style="margin-top: 1rem;">Maaf, ID Transaksi <b>${id}</b> tidak ditemukan di sistem kami. Pastikan format penulisan benar.</p>
          </div>
        `;
        return;
      }

      // Mock data based on ID
      const statuses = ['success', 'success', 'pending', 'success'];
      const status = statuses[id.length % statuses.length];
      const statusLabel = status === 'success' ? 'BERHASIL' : 'PENDING';
      const statusClass = status === 'success' ? 'status-success' : 'status-pending';

      resultArea.innerHTML = `
        <div class="invoice-details">
          <div style="text-align:center; margin-bottom: 2rem;">
            <span class="status-badge ${statusClass}">${statusLabel}</span>
            <p>Invoice ID: <b>${id.toUpperCase()}</b></p>
          </div>
          <div class="detail-row">
            <span class="detail-label">Produk</span>
            <span class="detail-value">Digital Premium Member</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tanggal</span>
            <span class="detail-value">${new Date().toLocaleDateString('id-ID')}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Metode Pembayaran</span>
            <span class="detail-value">Automatic QRIS</span>
          </div>
          <div class="detail-row" style="margin-top: 1rem; border-top: 1px dashed var(--border-color); padding-top: 1rem;">
            <span class="detail-label">Total Pembayaran</span>
            <span class="detail-value">Rp. 45.000</span>
          </div>
        </div>
        <button class="check-btn" style="width: 100%; margin-top: 2rem; background: #25d366;" onclick="window.open('https://wa.me/6289633011300', '_blank')">Hubungi Admin di WhatsApp</button>
      `;
    }, 1500);
  }
});
