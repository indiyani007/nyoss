# Warung Techno - Petunjuk Penggunaan Hosting

Paket ini sudah dilengkapi dengan sistem sinkronisasi hosting otomatis dan cadangan data:

## Daftar File:
1. `index.html`   : Halaman web utama
2. `style.css`    : File gaya tampilan (CSS)
3. `script.js`    : Logika aplikasi, keranjang/order, panel admin & sinkronisasi hosting
4. `api.php`      : Jembatan penyimpanan otomatis ke hosting (backend PHP)
5. `data.json`    : Tempat penyimpanan data produk, pesanan, dan pengaturan website

---

## Cara Pasang di Hosting:

### A. Untuk Hosting cPanel / DirectAdmin / PHP Shared Hosting (Rekomendasi Terbaik)
1. Buka File Manager di cPanel hosting Anda.
2. Masuk ke folder `public_html` (atau folder subdomain Anda).
3. Ekstrak dan unggah semua file ini (`index.html`, `style.css`, `script.js`, `api.php`, `data.json`).
4. Pastikan file `data.json` memiliki hak akses tulis (Permission 664 atau 666).
5. Selesai! Sekarang saat Anda mengedit produk atau pengaturan di Panel Admin (Password: `admin123`), perubahan akan **otomatis tersimpan permanen di hosting**.

---

### B. Untuk Hosting Statis (Vercel, GitHub Pages, Netlify)
1. Unggah seluruh file ke repositori GitHub atau deploy langsung ke Vercel/Netlify.
2. Saat mengedit melalui Panel Admin:
   - Masuk ke Panel Admin > Pengaturan Website > tab **Hosting & Backup**.
   - Klik tombol **Download data.json**.
   - Timpa (replace) file `data.json` di repositori GitHub/hosting Anda.
3. Semua pengunjung akan langsung melihat update produk yang baru.
