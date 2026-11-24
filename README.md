# PinjamRuang ITTS — Implementasi Komponen Dasar Antarmuka
> **Tugas 2 Praktikum Pemrograman Frontend (Modul 07)**  
> **Sub-CPMK:** CPMK082-1 — Mampu mengimplementasikan komponen dasar antarmuka dengan HTML, CSS, dan JavaScript murni.  
> **Institusi:** Institut Teknologi Telkom Surabaya (ITTS)  

---

## 📌 1. Deskripsi Proyek
**PinjamRuang ITTS** adalah aplikasi sistem informasi peminjaman sarana dan prasarana kampus berbasis web yang dirancang khusus untuk memfasilitasi kebutuhan organisasi mahasiswa (UKM, HIMA, dan BEM) serta unit pengelola Sarpras ITTS. 

Repositori ini mengimplementasikan antarmuka dari **Tugas 1 Wireframe (Layar 3: Katalog Ketersediaan Ruangan & Layar 5: Formulir Pengajuan Digital Multi-Step)** menggunakan **HTML5 Semantik**, **CSS Modern**, dan **JavaScript murni (Vanilla JS)** tanpa ketergantungan library/framework eksternal.

---

## 📂 2. Struktur Proyek
Proyek disusun dengan prinsip pemisahan tanggung jawab (*separation of concerns*) yang rapi dan terstruktur:

```text
pinjamruang-komponen/
├── index.html       # Struktur HTML5 semantik untuk 5 komponen utama
├── styles.css       # Styling CSS modern (Custom Properties, Nesting, :has(), :focus-visible)
├── script.js        # Logika interaktivitas, validasi form, dan aksesibilitas ARIA
└── README.md        # Dokumentasi lengkap proyek dan panduan pengujian
```

---

## 🚀 3. Cara Menjalankan Proyek
Aplikasi ini tidak memerlukan instalasi build tool atau dependensi `npm`. Anda dapat menjalankannya langsung melalui browser:

### Opsi A: Menggunakan Ekstensi VS Code Live Server (Direkomendasikan)
1. Buka folder `pinjamruang-komponen` di Visual Studio Code.
2. Klik kanan pada berkas `index.html`.
3. Pilih **"Open with Live Server"** (atau tekan shortcut `Alt + L, Alt + O`).
4. Halaman akan terbuka otomatis di alamat `http://127.0.0.1:5500/index.html`.

### Opsi B: Membuka Berkas Langsung di Browser
1. Navigasikan ke direktori `pinjamruang-komponen` melalui File Explorer.
2. Klik dua kali pada berkas `index.html` (atau klik kanan > *Open with* > Google Chrome / Microsoft Edge / Mozilla Firefox).

---

## 🧩 4. Rincian 5 Komponen Utama yang Diimplementasikan

| No | Nama Komponen | Lokasi Kode | Perilaku & Keputusan Desain Aksesibel |
|:--:|:---|:---|:---|
| **1** | **Header & Menu Navigasi Aksesibel (Mobile Disclosure)** | `index.html` `<header>`, `styles.css` `.header-utama`, `script.js` `inisialisasiMenuNav()` | Menggunakan elemen semantik `<header>` dan `<nav>`. Tombol `#tombol-menu` memiliki atribut `aria-expanded="false/true"` dan `aria-controls="menu-utama"`. Navigasi responsif untuk smartphone, mendukung penutupan otomatis dengan tombol keyboard `Escape` dan mengembalikan fokus kembali ke tombol menu (WAI-ARIA APG Disclosure Pattern). |
| **2** | **Kartu Ruangan & Badge Ketersediaan (Room Card Grid)** | `index.html` `<article.kartu-ruangan>`, `styles.css` `.kartu-ruangan`, `script.js` `inisialisasiPilihanRuangan()` | Disusun menggunakan tag `<article>` dengan heading `<h3>`, gambar ber-`alt` deskriptif, badge fasilitas lab, serta status ketersediaan ber-`role="status"`. Tombol aksi memiliki atribut `aria-label="Pilih Lab Komputer 3 untuk dipinjam"` yang ketika diklik akan otomatis mengisi kolom pilihan ruangan pada formulir secara dinamis. |
| **3** | **Formulir Pengajuan Peminjaman dengan Validasi Aksesibel** | `index.html` `<form#form-pengajuan>`, `styles.css` `.grup-input`, `script.js` `inisialisasiFormPengajuan()` | Formulir dengan atribut `novalidate` untuk validasi kustom di sisi klien. Setiap kolom terhubung dengan pesan galat melalui atribut `aria-describedby`. Memvalidasi nama agenda, tanggal peminjaman (hanya H+1 ke depan), sesi waktu, dan berkas TOR (wajib PDF, maks 5 MB). Jika tidak valid, kolom ditandai dengan `aria-invalid="true"`, menampilkan pesan kesalahan eksplisit, dan memindahkan fokus otomatis ke input pertama yang bermasalah. |
| **4** | **Dialog Konfirmasi Peminjaman Modal (`<dialog>`)** | `index.html` `<dialog#dialog-konfirmasi>`, `styles.css` `.modal-dialog`, `script.js` `inisialisasiDialogKonfirmasi()` | Menggunakan elemen bawaan HTML5 `<dialog>` yang dibuka menggunakan method native `showModal()`. Browser secara otomatis mengunci trap fokus di dalam dialog dan meredupkan latar belakang melalui pseudo-elemen `::backdrop`. Dilengkapi `aria-labelledby="judul-konfirmasi"`, tombol batal, dan tombol kirim dengan simulasi *loading button* (`aria-busy="true"` dan status pembaruan ke `role="status"`). |
| **5** | **Footer Layanan Sarpras & Hak Cipta** | `index.html` `<footer>`, `styles.css` `.footer-utama` | Komponen semantik `<footer>` yang memuat ringkasan informasi pos satpam kampus 24 jam, jam kerja helpdesk Sarpras ITTS, ketentuan SOP pengajuan, serta tanda hak cipta resmi `© 2026 PinjamRuang ITTS`. |

---

## ♿ 5. Penerapan Standar Aksesibilitas (WCAG 2.2 AA)
1. **Indikator Fokus Keyboard (`:focus-visible`):** Semua elemen interaktif (`<button>`, `<a>`, `<input>`, `<select>`) memiliki indikator fokus berkontras tinggi (`outline: 3px solid #2563eb; outline-offset: 3px;`) sehingga pengguna keyboard tidak kehilangan orientasi fokus visual.
2. **Keterbacaan Pembaca Layar (*Screen Reader*):**
   - Menggunakan `aria-expanded` dinamis pada menu disclosure.
   - Menggunakan `aria-describedby` untuk menghubungkan petunjuk dan pesan kesalahan input.
   - Menggunakan `aria-invalid="true"` saat input gagal divalidasi.
   - Menggunakan `aria-busy="true"` dan `role="status"` untuk mengumumkan proses pengiriman data dan pembaruan sistem secara langsung (*live region*).
3. **Kontras Warna & Skala Spacing:** Rasio kontras teks memenuhi standar minimal 4.5:1 (Level AA). Tata letak dan jarak antar komponen dibangun berbasis skala 8-pt grid token variabel CSS (`--ruang-1` sampai `--ruang-12`).

---

## 💡 6. Catatan Refleksi & Tantangan Pengerjaan
Tantangan terbesar dalam tugas ini adalah mengintegrasikan alur validasi formulir dan dialog konfirmasi modal tanpa mengorbankan aksesibilitas keyboard dan pembaca layar. Solusi yang diterapkan adalah menghindari pembuatan modal kustom berbasis `<div>`, melainkan memanfaatkan elemen native `<dialog>` bawaan HTML5 dan method `showModal()`, yang secara bawaan telah mengisolasi fokus keyboard dan menangani tombol `Escape`. Selain itu, pengelolaan pesan kesalahan dilakukan secara presisi dengan mengembalikan fokus ke elemen input galat pertama agar pengguna dengan disabilitas netra langsung mengetahui letak kekeliruan tanpa harus membaca ulang seluruh halaman.
