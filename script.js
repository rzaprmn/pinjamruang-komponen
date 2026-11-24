/**
 * ============================================================================
 * PINJAMRUANG ITTS — SCRIPT INTERAKTIF & AKSESIBEL (TUGAS 2 MODUL 07)
 * Memenuhi Standar WCAG 2.2 AA: Keyboard Trap, ARIA, & Status Announcer
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  inisialisasiMenuNav();
  inisialisasiPilihanRuangan();
  inisialisasiFormPengajuan();
  inisialisasiDialogKonfirmasi();
});

/**
 * ============================================================================
 * KOMPONEN 1: MENU NAVIGASI RESPONSIF (DISCLOSURE PATTERN)
 * Fitur: aria-expanded, aria-controls, Escape to Close, Focus Return
 * ============================================================================
 */
function inisialisasiMenuNav() {
  const tombolMenu = document.querySelector("#tombol-menu");
  const menuUtama = document.querySelector("#menu-utama");

  if (!tombolMenu || !menuUtama) return;

  // Toggle buka/tutup menu
  tombolMenu.addEventListener("click", () => {
    const isExpanded = tombolMenu.getAttribute("aria-expanded") === "true";
    const statusBaru = !isExpanded;

    tombolMenu.setAttribute("aria-expanded", String(statusBaru));
    menuUtama.hidden = !statusBaru;

    tombolMenu.setAttribute("aria-label", statusBaru ? "Tutup menu navigasi" : "Buka menu navigasi");
  });

  // Aksesibilitas Keyboard: Tutup menu saat menekan tombol Escape dan kembalikan fokus
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && tombolMenu.getAttribute("aria-expanded") === "true") {
      tombolMenu.setAttribute("aria-expanded", "false");
      menuUtama.hidden = true;
      tombolMenu.setAttribute("aria-label", "Buka menu navigasi");
      tombolMenu.focus(); // Mengembalikan fokus ke pemicu
    }
  });

  // Tutup menu saat tautan navigasi diklik di tampilan mobile
  const navTautan = menuUtama.querySelectorAll(".nav-tautan");
  navTautan.forEach((tautan) => {
    tautan.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        tombolMenu.setAttribute("aria-expanded", "false");
        menuUtama.hidden = true;
        tombolMenu.setAttribute("aria-label", "Buka menu navigasi");
      }
    });
  });
}

/**
 * ============================================================================
 * KOMPONEN 2: KARTU RUANGAN INTERAKTIF
 * Fitur: Memilih ruangan dari kartu katalog langsung ke kolom input form
 * ============================================================================
 */
function inisialisasiPilihanRuangan() {
  const tombolPilih = document.querySelectorAll(".tombol-pilih-ruang");
  const inputRuangan = document.querySelector("#ruangan");
  const formSection = document.querySelector("#form-pengajuan");

  tombolPilih.forEach((tombol) => {
    tombol.addEventListener("click", () => {
      const namaRuang = tombol.dataset.namaRuang || tombol.getAttribute("data-nama-ruang");
      if (inputRuangan && namaRuang) {
        inputRuangan.value = namaRuang;
        
        // Hapus galat ruangan jika sebelumnya ada
        hapusGalat(inputRuangan, document.querySelector("#galat-ruangan"));

        // Efek visual lembut: scroll ke formulir dan fokus
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
        
        // Umumkan pemilihan ke screen reader
        const statusGlobal = document.querySelector("#status-pengajuan");
        if (statusGlobal) {
          statusGlobal.className = "status-global status-tampil";
          statusGlobal.textContent = `Ruangan ${namaRuang} berhasil dipilih ke formulir.`;
          setTimeout(() => {
            statusGlobal.className = "status-global";
          }, 3500);
        }
      }
    });
  });
}

/**
 * ============================================================================
 * KOMPONEN 3: FORMULIR PENGAJUAN PEMINJAMAN DENGAN VALIDASI AKSESIBEL
 * Fitur: novalidate, aria-describedby, aria-invalid, & Focus First Error
 * ============================================================================
 */
function inisialisasiFormPengajuan() {
  const form = document.querySelector("#form-pengajuan");
  if (!form) return;

  const elemenForm = {
    ruangan: document.querySelector("#ruangan"),
    organisasi: document.querySelector("#organisasi"),
    agenda: document.querySelector("#agenda"),
    tanggal: document.querySelector("#tanggal"),
    sesi: document.querySelector("#sesi"),
    peserta: document.querySelector("#peserta"),
    berkas: document.querySelector("#berkas-tor"),
  };

  const elemenGalat = {
    ruangan: document.querySelector("#galat-ruangan"),
    organisasi: document.querySelector("#galat-organisasi"),
    agenda: document.querySelector("#galat-agenda"),
    tanggal: document.querySelector("#galat-tanggal"),
    sesi: document.querySelector("#galat-sesi"),
    peserta: document.querySelector("#galat-peserta"),
    berkas: document.querySelector("#galat-berkas"),
  };

  // Set tanggal minimal peminjaman adalah hari esok (H+1)
  if (elemenForm.tanggal) {
    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    const formatBesok = besok.toISOString().split("T")[0];
    elemenForm.tanggal.min = formatBesok;
  }

  // Event submit formulir
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Bersihkan semua status galat sebelumnya
    Object.keys(elemenForm).forEach((k) => {
      hapusGalat(elemenForm[k], elemenGalat[k]);
    });

    let adaGalat = false;
    let fokusPertama = null;

    // 1. Validasi Ruangan
    if (!elemenForm.ruangan.value.trim()) {
      tampilkanGalat(elemenForm.ruangan, elemenGalat.ruangan, "Silakan pilih salah satu ruangan dari katalog.");
      adaGalat = true;
      fokusPertama = fokusPertama || elemenForm.ruangan;
    }

    // 2. Validasi Nama Organisasi
    if (!elemenForm.organisasi.value.trim()) {
      tampilkanGalat(elemenForm.organisasi, elemenGalat.organisasi, "Nama organisasi atau UKM wajib diisi.");
      adaGalat = true;
      fokusPertama = fokusPertama || elemenForm.organisasi;
    } else if (elemenForm.organisasi.value.trim().length < 3) {
      tampilkanGalat(elemenForm.organisasi, elemenGalat.organisasi, "Nama organisasi minimal 3 karakter.");
      adaGalat = true;
      fokusPertama = fokusPertama || elemenForm.organisasi;
    }

    // 3. Validasi Nama Agenda Kegiatan
    if (!elemenForm.agenda.value.trim()) {
      tampilkanGalat(elemenForm.agenda, elemenGalat.agenda, "Nama agenda kegiatan wajib diisi.");
      adaGalat = true;
      fokusPertama = fokusPertama || elemenForm.agenda;
    } else if (elemenForm.agenda.value.trim().length < 5) {
      tampilkanGalat(elemenForm.agenda, elemenGalat.agenda, "Deskripsi agenda kegiatan minimal 5 karakter.");
      adaGalat = true;
      fokusPertama = fokusPertama || elemenForm.agenda;
    }

    // 4. Validasi Tanggal Peminjaman
    if (!elemenForm.tanggal.value) {
      tampilkanGalat(elemenForm.tanggal, elemenGalat.tanggal, "Pilih tanggal pelaksanaan kegiatan.");
      adaGalat = true;
      fokusPertama = fokusPertama || elemenForm.tanggal;
    }

    // 5. Validasi Sesi Waktu
    if (!elemenForm.sesi.value) {
      tampilkanGalat(elemenForm.sesi, elemenGalat.sesi, "Pilih salah satu sesi waktu peminjaman.");
      adaGalat = true;
      fokusPertama = fokusPertama || elemenForm.sesi;
    }

    // 6. Validasi Estimasi Peserta
    const jumlahPeserta = parseInt(elemenForm.peserta.value, 10);
    if (!elemenForm.peserta.value || isNaN(jumlahPeserta) || jumlahPeserta < 1) {
      tampilkanGalat(elemenForm.peserta, elemenGalat.peserta, "Jumlah peserta minimal 1 orang.");
      adaGalat = true;
      fokusPertama = fokusPertama || elemenForm.peserta;
    }

    // 7. Validasi Unggah Berkas TOR (Format PDF & Maks 5MB)
    const file = elemenForm.berkas.files[0];
    if (!file) {
      tampilkanGalat(elemenForm.berkas, elemenGalat.berkas, "Dokumen TOR/Proposal berformat PDF wajib diunggah.");
      adaGalat = true;
      fokusPertama = fokusPertama || elemenForm.berkas;
    } else {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const isUkuranValid = file.size <= 5 * 1024 * 1024; // 5 MB

      if (!isPdf) {
        tampilkanGalat(elemenForm.berkas, elemenGalat.berkas, "Format berkas harus PDF (.pdf).");
        adaGalat = true;
        fokusPertama = fokusPertama || elemenForm.berkas;
      } else if (!isUkuranValid) {
        tampilkanGalat(elemenForm.berkas, elemenGalat.berkas, "Ukuran berkas melebihi batas maksimal 5 MB.");
        adaGalat = true;
        fokusPertama = fokusPertama || elemenForm.berkas;
      }
    }

    // Jika terjadi kesalahan: alihkan fokus ke kolom galat pertama
    if (adaGalat) {
      fokusPertama.focus();
      return;
    }

    // Jika semua valid: buka Dialog Konfirmasi (<dialog> Modal)
    bukaDialogKonfirmasi({
      ruangan: elemenForm.ruangan.value,
      organisasi: elemenForm.organisasi.value,
      agenda: elemenForm.agenda.value,
      waktu: `${elemenForm.tanggal.value} (${elemenForm.sesi.value})`,
      berkas: file ? file.name : "-",
    });
  });

  // Tombol reset formulir
  form.addEventListener("reset", () => {
    Object.keys(elemenForm).forEach((k) => {
      hapusGalat(elemenForm[k], elemenGalat[k]);
    });
    elemenForm.ruangan.value = "Lab Komputer 3 (Gedung B Lt. 2)";
  });
}

/**
 * Utilitas untuk menampilkan galat aksesibel
 */
function tampilkanGalat(input, elemenTeksGalat, pesan) {
  if (input) input.setAttribute("aria-invalid", "true");
  if (elemenTeksGalat) elemenTeksGalat.textContent = pesan;
}

/**
 * Utilitas untuk menghapus galat aksesibel
 */
function hapusGalat(input, elemenTeksGalat) {
  if (input) input.removeAttribute("aria-invalid");
  if (elemenTeksGalat) elemenTeksGalat.textContent = "";
}

/**
 * ============================================================================
 * KOMPONEN 4: DIALOG KONFIRMASI PEMINJAMAN (<dialog> MODAL)
 * Fitur: showModal(), aria-busy loading button, announcer role="status"
 * ============================================================================
 */
let dialogModal = null;

function inisialisasiDialogKonfirmasi() {
  dialogModal = document.querySelector("#dialog-konfirmasi");
  const tombolBatal = document.querySelector("#tombol-batal-modal");
  const tombolKirim = document.querySelector("#tombol-kirim-modal");
  const form = document.querySelector("#form-pengajuan");
  const statusGlobal = document.querySelector("#status-pengajuan");

  if (!dialogModal) return;

  // Tombol Batal Modal
  if (tombolBatal) {
    tombolBatal.addEventListener("click", () => {
      dialogModal.close();
      const tombolAjukan = document.querySelector("#tombol-ajukan");
      if (tombolAjukan) tombolAjukan.focus();
    });
  }

  // Tombol Kirim / Konfirmasi Modal (Simulasi Pengiriman ke Server)
  if (tombolKirim) {
    tombolKirim.addEventListener("click", () => {
      // 1. Ubah tombol ke status memuat (loading state)
      tombolKirim.disabled = true;
      tombolKirim.textContent = "Mengirimkan Berkas…";
      tombolKirim.setAttribute("aria-busy", "true");

      // 2. Simulasi latensi jaringan (1000 ms)
      setTimeout(() => {
        tombolKirim.disabled = false;
        tombolKirim.textContent = "Ya, Kirimkan Pengajuan";
        tombolKirim.setAttribute("aria-busy", "false");

        // Tutup modal
        dialogModal.close();

        // Tampilkan notifikasi sukses yang terbaca screen reader
        if (statusGlobal) {
          statusGlobal.className = "status-global status-tampil";
          statusGlobal.textContent = "✓ Pengajuan peminjaman berhasil dikirim! Silakan pantau status persetujuan e-approval secara berkala.";
        }

        // Reset form setelah pengajuan berhasil
        if (form) {
          form.reset();
        }

        // Kembalikan fokus ke status agar pembaca layar mengumumkannya
        statusGlobal.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 1000);
    });
  }
}

/**
 * Mengisi data ringkasan dan membuka dialog modal
 */
function bukaDialogKonfirmasi(data) {
  if (!dialogModal) return;

  document.querySelector("#ringkas-ruangan").textContent = data.ruangan;
  document.querySelector("#ringkas-organisasi").textContent = data.organisasi;
  document.querySelector("#ringkas-agenda").textContent = data.agenda;
  document.querySelector("#ringkas-waktu").textContent = data.waktu;
  document.querySelector("#ringkas-berkas").textContent = data.berkas;

  // Buka modal secara semantik dengan trap fokus otomatis
  dialogModal.showModal();
}
