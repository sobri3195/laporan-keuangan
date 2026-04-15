# PRD - SIMON Keuangan RS

## Objective
Menyediakan sistem monitoring laporan keuangan rumah sakit untuk PNBP dan BLU secara terpusat.

## Users & Permissions
- ADMIN_PUSAT: seluruh data, approval, master management, export.
- ADMIN_RS: data rumah sakit sendiri, input/submit report.
- VIEWER: read-only dashboard/report.

## Workflow Status
DRAFT -> SUBMITTED -> IN_REVIEW -> REVISION_REQUESTED -> APPROVED -> LOCKED.

## Key Rules
- Satu laporan aktif per rumah sakit + period + entity.
- Nilai kosong numerik tetap `null`.
- Bagi nol menghasilkan `null` (ditampilkan `N/A`).
- Draft tidak muncul default di executive dashboard.
- Period LOCKED tidak dapat diedit.
- Seluruh perubahan penting ke audit trail.

## Backlog Penguatan Fitur (Roadmap Berikutnya)

### 1) Status kelengkapan per form
- Tampilkan indikator `x dari y field terisi` pada level form dan section.
- Definisikan `100% complete` hanya bila seluruh field wajib terisi + valid.
- Tombol submit disabled bila completeness < 100% atau ada error validasi.

### 2) Freeze periode
- Setelah melewati deadline dan laporan berstatus `APPROVED`, period dapat dikunci (`LOCKED`).
- Data pada period `LOCKED` bersifat read-only untuk seluruh role non-superadmin.
- Aksi lock/unlock wajib tercatat di audit log.

### 3) Multi-level approval
- Dukungan hirarki approval bertahap:
  1. Operator RS
  2. Verifikator
  3. Admin Pusat
  4. Pimpinan
- Setiap transisi approval punya SLA, notifikasi, dan jejak audit.
- Konfigurasi level approval dibuat fleksibel agar dapat dinyalakan bertahap per periode.

### 4) Catatan per field
- Reviewer/admin pusat dapat memberi komentar pada field spesifik (inline comment).
- Komentar memiliki status (`OPEN`, `RESOLVED`) dan histori penyelesaian.
- Komentar per field harus tampil kembali saat operator membuka draft/revisi.

### 5) Anomaly engine ringan
- Rule awal yang diprioritaskan:
  - pendapatan naik > 200%
  - pengeluaran turun > 80%
  - hutang = 0 tapi aset tinggi
  - ekuitas negatif
  - current ratio sangat rendah
- Hasil deteksi ditampilkan sebagai warning, bukan blocker submit, pada fase awal.
- Semua threshold dibuat konfigurabel di `system_configs`.

### 6) Rekap otomatis per wilayah
- Dashboard pusat harus dapat agregasi per RS dan per wilayah/komando.
- Tersedia filter drill-down wilayah -> RS.
- Rekap wilayah memakai data `submitted/approved` sesuai filter status.

### 7) Deadline dashboard
- Tampilkan countdown deadline pelaporan per periode (H-xx, H-0, overdue).
- Gunakan indikator warna untuk risiko keterlambatan.
- Hitung deadline berdasarkan zona waktu sistem yang disepakati.

### 8) Draft vs final distinction
- Simpan draft otomatis tanpa mengubah status final.
- Dashboard pusat default hanya membaca status `SUBMITTED`, `APPROVED`, atau `LOCKED`.
- Draft tetap bisa diakses operator untuk melanjutkan pengisian.

### 9) Import dari Excel
- Sediakan template Excel standar sesuai struktur field sistem.
- Upload file akan diparse, divalidasi, lalu dipetakan ke draft report.
- Error parsing/validasi harus mengembalikan daftar baris-kolom bermasalah.

### 10) API readiness
- Tetapkan kontrak service agar logika bisnis tidak bergantung ke Google Sheets.
- Pisahkan lapisan repository (storage adapter) dari service/domain.
- Target migrasi yang disiapkan: Supabase (PostgreSQL), PostgreSQL mandiri, Firebase, dan backend Node.js.
