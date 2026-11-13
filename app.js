/**
 * Warung Techno - Main Frontend Script
 * Mendukung cPanel (dengan api.php) dan Vercel/GitHub Pages (fallback ke data.json)
 */

const CONFIG = {
  appName: 'Warung Techno',
  whatsappNumber: '6281234567890', // Ganti dengan nomor WhatsApp admin Anda (format 62...)
  apiEndpoint: 'api.php',
  jsonFallback: 'data.json'
};

const state = {
  apps: [],
  selectedCategory: 'Semua',
  searchQuery: '',
  activeApp: null
};

// Helper: Format Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

// Helper: Toast Notification
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Fetch Apps Data: Otomatis deteksi PHP atau Static JSON
async function fetchApps() {
  try {
    // Coba load via api.php terlebih dahulu (untuk cPanel / server PHP)
    const response = await fetch(`${CONFIG.apiEndpoint}?action=get_apps`, {
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      const result = await response.json();
      if (result.status === 'success' && Array.isArray(result.data)) {
        return result.data;
      }
    }
    throw new Error('Fallback to data.json');
  } catch (err) {
    // Fallback otomatis ke data.json (untuk Vercel, GitHub Pages, atau static host)
    console.log('Memuat data dari data.json (static mode)...');
    const staticResponse = await fetch(CONFIG.jsonFallback);
    return await staticResponse.json();
  }
}

// Render Aplikasi Utama
function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const categories = ['Semua', ...new Set(state.apps.map(item => item.category))];

  // Filter list
  const filteredApps = state.apps.filter(item => {
    const matchesCategory = state.selectedCategory === 'Semua' || item.category === state.selectedCategory;
    const query = state.searchQuery.toLowerCase();
    const matchesQuery = !query || 
      item.name.toLowerCase().includes(query) ||
      item.tagline.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  appContainer.innerHTML = `
    <!-- Header -->
    <header class="site-header">
      <div class="container nav-wrap">
        <a href="#" class="brand">
          <div class="brand-icon">w</div>
          <span>${CONFIG.appName}</span>
        </a>

        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="search" 
            id="searchInput" 
            placeholder="Cari aplikasi, streaming, AI tools..." 
            value="${state.searchQuery}"
            autocomplete="off"
          />
        </div>

        <div class="header-actions">
          <a href="https://wa.me/${CONFIG.whatsappNumber}?text=Halo%20Warung%20Techno,%20saya%20ingin%20tanya-tanya%20produk" target="_blank" class="btn-contact">
            <span>Hubungi CS</span>
            <span>💬</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-badge">⚡ Upgrade Keseharianmu Lebih Murah & Legal</div>
        <h1>Aplikasi & Tools Premium <br><span>Harga Ramah Pelajar</span></h1>
        <p class="hero-sub">Dapatkan langganan AI tools, hiburan streaming, dan software produktivitas pilihan dengan garansi replace penuh dan proses instan.</p>
        
        <div class="hero-stats">
          <div class="stat-item"><span>🛡️</span> <strong>100%</strong> Bergaransi Penuh</div>
          <div class="stat-item"><span>⚡</span> <strong>Proses Cepat</strong> 5-10 Menit</div>
          <div class="stat-item"><span>👥</span> <strong>10.000+</strong> Pelanggan Puas</div>
        </div>
      </section>

      <!-- Category Filter -->
      <div class="categories-wrap" id="categoriesBar">
        ${categories.map(cat => `
          <button class="cat-btn ${cat === state.selectedCategory ? 'active' : ''}" data-category="${cat}">
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Products Grid -->
      ${filteredApps.length > 0 ? `
        <div class="products-grid">
          ${filteredApps.map(item => `
            <article class="card">
              <div class="card-top">
                <div class="card-icon" style="background: ${item.color}15; color: ${item.color};">
                  ${item.icon || '🚀'}
                </div>
                ${item.badge ? `<span class="badge-pill highlight">${item.badge}</span>` : ''}
              </div>

              <div class="card-category">${item.category}</div>
              <h2 class="card-title">${item.name}</h2>
              <p class="card-tagline">${item.tagline}</p>

              <div class="card-meta">
                <span class="card-rating">★ ${item.rating}</span>
                <span>•</span>
                <span>${item.sold.toLocaleString('id-ID')} Terjual</span>
              </div>

              <div class="card-price-row">
                <span class="price-main">${formatRupiah(item.price)}</span>
                <span class="price-period">${item.period}</span>
                ${item.price_original ? `<span class="price-strike">${formatRupiah(item.price_original)}</span>` : ''}
              </div>

              <div class="card-actions">
                <button class="btn btn-outline btn-detail" data-id="${item.id}">Detail</button>
                <button class="btn btn-primary btn-order" data-id="${item.id}">Order</button>
              </div>
            </article>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-icon">🔎</div>
          <h3>Produk tidak ditemukan</h3>
          <p>Coba gunakan kata kunci pencarian yang lain atau pilih kategori Semua.</p>
        </div>
      `}
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="container">
        <div class="footer-content">
          <div>
            <a href="#" class="brand">
              <div class="brand-icon" style="width:32px; height:32px; font-size:1.1rem;">w</div>
              <span>${CONFIG.appName}</span>
            </a>
            <p class="footer-copy" style="margin-top: 0.5rem;">Solusi langganan akun digital premium terpercaya, hemat, dan bergaransi.</p>
          </div>
          <div class="footer-links">
            <a href="https://wa.me/${CONFIG.whatsappNumber}" target="_blank">WhatsApp Support</a>
            <a href="#" onclick="alert('Semua produk bergaransi replace selama masa aktif berlangganan.')">Garansi</a>
            <a href="#" onclick="alert('Syarat: Tidak mengganti data profil/email yang dilarang pada deskripsi produk.')">Ketentuan</a>
          </div>
        </div>
        <div class="footer-copy" style="text-align: center; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
          &copy; ${new Date().getFullYear()} ${CONFIG.appName}. All rights reserved.
        </div>
      </div>
    </footer>
  `;

  attachEventListeners();
}

// Attach Event Listeners
function attachEventListeners() {
  // Search input live filter
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderApp();
      // Keep focus on input after re-render
      const newInput = document.getElementById('searchInput');
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(newInput.value.length, newInput.value.length);
      }
    });
  }

  // Category buttons
  const catButtons = document.querySelectorAll('.cat-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedCategory = btn.getAttribute('data-category');
      renderApp();
    });
  });

  // Detail buttons
  const detailBtns = document.querySelectorAll('.btn-detail');
  detailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openModal(id);
    });
  });

  // Order buttons
  const orderBtns = document.querySelectorAll('.btn-order');
  orderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openModal(id, true);
    });
  });
}

// Buka Modal Dialog
function openModal(id, autoFocusOrder = false) {
  const item = state.apps.find(a => a.id === id);
  if (!item) return;

  const modal = document.getElementById('modal');
  if (!modal) return;

  state.activeApp = item;

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-brand">
          <div class="modal-icon" style="background: ${item.color}15; color: ${item.color};">
            ${item.icon || '🚀'}
          </div>
          <div>
            <h3 class="modal-title">${item.name}</h3>
            <span class="badge-pill">${item.category}</span>
          </div>
        </div>
        <button class="btn-close" id="modalCloseBtn" aria-label="Tutup">&times;</button>
      </div>

      <p class="modal-desc">${item.description}</p>

      <div class="modal-features-title">Keunggulan & Fitur:</div>
      <ul class="modal-features">
        ${item.features.map(f => `
          <li><span class="check">✓</span> <span>${f}</span></li>
        `).join('')}
      </ul>

      <div class="order-form">
        <div class="form-group">
          <label for="buyerName">Nama Anda (Opsional)</label>
          <input type="text" id="buyerName" placeholder="Contoh: Budi Santoso">
        </div>
        <div class="form-group">
          <label for="buyerNotes">Catatan / Email (Opsional)</label>
          <input type="text" id="buyerNotes" placeholder="Contoh: Akun diinvite ke email saya">
        </div>
      </div>

      <div class="modal-footer">
        <div class="modal-price-block">
          <span class="modal-price-label">Total Harga:</span>
          <span class="modal-price-value">${formatRupiah(item.price)} <small style="font-size:0.75rem; color:var(--text-muted);">${item.period}</small></span>
        </div>
        <button class="btn btn-primary" id="btnConfirmOrder" style="padding: 0.75rem 1.4rem;">
          Order via WhatsApp 💬
        </button>
      </div>
    </div>
  `;

  modal.showModal();

  // Close button listener
  document.getElementById('modalCloseBtn').addEventListener('click', () => {
    modal.close();
  });

  // Backdrop click to close
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      modal.close();
    }
  });

  // Confirm Order via WhatsApp
  document.getElementById('btnConfirmOrder').addEventListener('click', () => {
    processOrder(item);
  });

  if (autoFocusOrder) {
    const nameInput = document.getElementById('buyerName');
    if (nameInput) nameInput.focus();
  }
}

// Proses Order ke WhatsApp
async function processOrder(item) {
  const buyerName = document.getElementById('buyerName')?.value.trim() || 'Pelanggan';
  const buyerNotes = document.getElementById('buyerNotes')?.value.trim() || '';

  showToast('Menyiapkan pesanan Anda...');

  try {
    // Coba simpan/kirim via API PHP jika tersedia
    const response = await fetch(`${CONFIG.apiEndpoint}?action=create_order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_name: item.name,
        buyer_name: buyerName,
        notes: buyerNotes
      })
    });

    if (response.ok) {
      const resData = await response.json();
      if (resData.whatsapp_url) {
        window.open(resData.whatsapp_url, '_blank');
        document.getElementById('modal')?.close();
        return;
      }
    }
  } catch (e) {
    // Abaikan jika running static (Vercel / GitHub)
  }

  // Fallback client-side WhatsApp link generator
  const orderId = 'WT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  let message = `Halo ${CONFIG.appName}, saya ingin memesan:\n` +
    `📦 Produk: ${item.name} (${formatRupiah(item.price)} ${item.period})\n` +
    `👤 Nama: ${buyerName}\n` +
    `🆔 Ref ID: ${orderId}`;
  
  if (buyerNotes) {
    message += `\n💬 Catatan: ${buyerNotes}`;
  }

  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
  document.getElementById('modal')?.close();
  showToast('Membuka WhatsApp...');
}

// Inisialisasi Aplikasi Saat Halaman Selesai Dimuat
document.addEventListener('DOMContentLoaded', async () => {
  try {
    state.apps = await fetchApps();
    renderApp();
  } catch (err) {
    console.error('Gagal memuat data aplikasi:', err);
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = `
        <div style="text-align:center; padding: 4rem 1rem; color: #ef4444;">
          <h2>Gagal Memuat Data</h2>
          <p>Pastikan file data.json atau api.php berada di direktori yang sama.</p>
        </div>
      `;
    }
  }
});
