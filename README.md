# 🚀 Warung Techno — Web App Store & Catalog

Aplikasi web modern, responsif, dan ringan untuk katalog produk & langganan akun digital premium.
Siap pakai dan kompatibel untuk **cPanel**, **Vercel**, dan **GitHub Pages**.

---

## 📁 Struktur File

```text
warung-techno/
├── index.html       # Tampilan antarmuka utama (HTML5 semantik)
├── style.css        # Desain modern, clean UI, dan responsive layout
├── script.js        # Logika aplikasi, pencarian, filter, modal, & auto fallback
├── app.js           # Alias dari script.js untuk kompatibilitas
├── api.php          # Backend REST API untuk cPanel / server PHP
├── data.json        # Database lokal / fallback untuk static hosting (Vercel / GitHub)
├── vercel.json      # Konfigurasi routing untuk deploy Vercel
└── README.md        # Panduan instalasi dan penggunaan
```

---

## ⚙️ Konfigurasi Nomor WhatsApp

Buka file `script.js` (dan `api.php`), lalu ubah nomor WhatsApp sesuai nomor CS / admin Anda:

```javascript
// Di file script.js baris ke-8:
whatsappNumber: '6281234567890', // Gunakan format internasional tanpa tanda + (contoh: 628xxxxxxxx)
```

---

## 🌐 Cara Upload & Deploy

### 1. Upload ke cPanel (Hosting Apache / Litespeed / Nginx + PHP)
1. Login ke akun **cPanel** Anda.
2. Buka menu **File Manager** -> masuk ke folder `public_html` (atau folder subdomain Anda).
3. Klik tombol **Upload**, lalu pilih file `warung-techno.zip`.
4. Setelah selesai upload, klik kanan file zip dan pilih **Extract**.
5. Pastikan file `index.html`, `api.php`, `data.json`, dll berada langsung di dalam folder root web Anda.
6. Akses domain Anda. Fitur REST API PHP dan WhatsApp order akan aktif otomatis.

### 2. Upload ke Vercel (Gratis & Cepat)
1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Drag and drop folder `warung-techno` atau import repository GitHub Anda.
3. Klik **Deploy**.
4. Website akan langsung aktif dalam hitungan detik (aplikasi otomatis membaca `data.json` secara statis dan seamless).

### 3. Upload ke GitHub Pages (Gratis)
1. Buat repository baru di GitHub (misal: `warung-techno`).
2. Upload semua file (`index.html`, `style.css`, `script.js`, `data.json`, dll) ke repository.
3. Buka tab **Settings** -> **Pages**.
4. Pada bagian **Build and deployment**, pilih branch `main` (atau `master`) dan folder `/ (root)`.
5. Klik **Save**. Tunggu 1 menit, web Anda siap diakses di `https://username.github.io/warung-techno`.

---

## ✨ Fitur Unggulan
- **Universal Mode**: Otomatis mendeteksi backend PHP (`api.php`) jika ada, dan otomatis beralih (*graceful fallback*) ke `data.json` saat di-deploy di static host (Vercel / GitHub Pages).
- **Live Search & Filter Kategori**: Filter instan tanpa refresh halaman.
- **Order Form & Integrasi WhatsApp**: Pesanan langsung dikonversi menjadi format chat WhatsApp yang rapi dan profesional.
- **Mobile Friendly**: Responsif di smartphone, tablet, maupun layar desktop.
