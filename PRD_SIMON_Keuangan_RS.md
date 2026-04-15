# PRD — Product Requirements Document

## 1.1 Nama Produk
**SIMON-Keuangan RS**  
Sistem Monitoring Laporan Keuangan Rumah Sakit untuk pelaporan PNBP dan BLU berbasis web.

## 1.2 Latar Belakang
Saat ini pelaporan keuangan RS masih banyak bergantung pada file spreadsheet manual. Pola ini menimbulkan beberapa masalah:
- data tersebar dan tidak real-time,
- format pengisian tidak seragam,
- banyak field kosong terbaca sebagai nilai nol,
- sulit memonitor unit yang belum mengisi,
- approval dan revisi tidak terlacak dengan baik,
- dashboard nasional harus direkap manual.

Diperlukan aplikasi web terpusat yang memungkinkan RS mengisi data online, menyimpan ke Google Sheets, dan dipantau oleh admin pusat melalui dashboard.

## 1.3 Problem Statement
Instansi membutuhkan sistem yang:
- mempermudah input laporan periodik oleh tiap RS,
- memastikan validasi data sebelum submit final,
- menampilkan status kepatuhan pelaporan secara real-time,
- menyediakan dashboard analitik untuk pimpinan,
- memiliki audit trail dan workflow revisi.

## 1.4 Tujuan Produk
Tujuan utama:
- digitalisasi proses input laporan keuangan RS,
- monitoring kepatuhan dan kualitas data,
- percepatan rekap dan analisis tingkat pusat,
- pengurangan error input dan duplikasi,
- peningkatan transparansi dan akuntabilitas.

## 1.5 Target Pengguna
### Admin Pusat
Mengelola master data, periode, monitoring seluruh RS, approval, revisi, dan dashboard agregat.

### Admin RS
Mengisi laporan keuangan RS masing-masing, menyimpan draft, submit final, melihat histori revisi, dan memantau dashboard unit sendiri.

### Viewer / Pimpinan
Melihat dashboard dan laporan dalam mode baca saja.

## 1.6 Scope Produk
### In Scope
- login dan role-based access,
- master data RS, user, periode,
- input laporan PNBP,
- input laporan BLU,
- autosave draft,
- submit final,
- approval/revisi,
- dashboard agregat,
- dashboard unit,
- monitoring status submit,
- audit trail,
- export laporan,
- notifikasi deadline dan status,
- integrasi Google Sheets via Google Apps Script.

### Out of Scope (fase awal)
- integrasi ERP/SIMRS,
- SSO enterprise,
- tanda tangan digital,
- WhatsApp gateway native,
- machine learning forecasting,
- database SQL production-grade.

## 1.7 User Stories
### Sebagai Admin RS
- saya ingin login ke sistem agar bisa mengakses hanya data RS saya,
- saya ingin mengisi data keuangan per periode,
- saya ingin menyimpan draft sebelum submit final,
- saya ingin melihat jika ada field yang belum lengkap,
- saya ingin melihat catatan revisi dari admin pusat,
- saya ingin submit ulang setelah revisi.

### Sebagai Admin Pusat
- saya ingin melihat RS mana yang sudah dan belum submit,
- saya ingin membuka detail laporan setiap RS,
- saya ingin approve atau meminta revisi,
- saya ingin melihat dashboard agregat nasional,
- saya ingin mengekspor data per periode.

### Sebagai Viewer/Pimpinan
- saya ingin melihat ringkasan indikator utama,
- saya ingin membandingkan antar RS dan antar periode,
- saya ingin melihat unit dengan anomali atau risiko likuiditas.

## 1.8 Functional Requirements
### A. Authentication & Authorization
- sistem harus menyediakan login,
- sistem harus memiliki role: `ADMIN_PUSAT`, `ADMIN_RS`, `VIEWER`,
- sistem harus membatasi akses halaman dan data berdasarkan role,
- sistem harus menyimpan session login,
- sistem harus mendukung logout.

### B. Master Data
- CRUD master RS,
- CRUD user,
- CRUD periode pelaporan,
- pengaturan status aktif/nonaktif,
- relasi user ke RS tertentu,
- hanya admin pusat yang dapat mengubah master data.

### C. Input Laporan
#### PNBP
**Field input:**
- periode,
- rs_id,
- pendapatan,
- pengeluaran,
- piutang,
- persediaan,
- hutang.

**Field terhitung:**
- `sisa_saldo = pendapatan - pengeluaran`
- `aset_lancar = sisa_saldo + piutang + persediaan`
- `ekuitas = aset_lancar - hutang`
- `current_ratio = aset_lancar / hutang`
- `cash_ratio = sisa_saldo / hutang`

#### BLU
**Field input:**
- periode,
- rs_id,
- saldo_awal,
- pendapatan,
- pengeluaran,
- piutang,
- persediaan,
- hutang.

**Field terhitung:**
- `sisa_saldo_akhir = saldo_awal + pendapatan - pengeluaran`
- `aset_lancar = sisa_saldo_akhir + piutang + persediaan`
- `ekuitas = aset_lancar - hutang`
- `current_ratio = aset_lancar / hutang`
- `cash_ratio = sisa_saldo_akhir / hutang`

### D. Workflow
**Status data:**
- `DRAFT`
- `SUBMITTED`
- `IN_REVIEW`
- `REVISION_REQUESTED`
- `APPROVED`
- `LOCKED`

**Aturan:**
- draft boleh diedit admin RS,
- submitted tidak boleh diubah kecuali dikembalikan ke revisi,
- approved dapat dikunci oleh admin pusat,
- hanya satu laporan aktif per RS per periode per jenis entitas.

### E. Validation
- field wajib harus diisi sebelum submit,
- nilai numerik harus valid,
- nilai kosong tidak boleh dibaca sebagai nol otomatis,
- rasio tidak boleh menghasilkan `NaN`, `Infinity`, atau `#DIV/0`,
- jika hutang = 0 maka rasio ditampilkan sebagai `N/A`,
- sistem harus mendeteksi duplikasi data,
- sistem harus memberi warning untuk anomali.

### F. Dashboard
- KPI total RS,
- total submit,
- total belum submit,
- total pendapatan,
- total pengeluaran,
- total aset lancar,
- total hutang,
- rata-rata current ratio,
- rata-rata cash ratio,
- tren periodik,
- ranking RS,
- heatmap kepatuhan submit,
- filter periode, wilayah, jenis entitas, status.

### G. Approval & Review
- admin pusat dapat lihat detail data,
- admin pusat dapat beri komentar,
- admin pusat dapat approve,
- admin pusat dapat minta revisi,
- admin RS dapat melihat alasan revisi,
- histori approval harus terekam.

### H. Notification
- notifikasi in-app,
- email pengingat deadline,
- email submit berhasil,
- email revisi,
- email approved.

### I. Reporting & Export
- export Excel,
- export CSV,
- print-ready PDF,
- laporan per RS,
- laporan agregat,
- laporan keterlambatan,
- laporan anomali.

### J. Audit Trail
- simpan siapa input,
- siapa edit,
- kapan edit,
- field yang berubah,
- nilai lama dan baru,
- perubahan status workflow.

## 1.9 Non-Functional Requirements
- web responsive,
- loading cepat pada data ratusan RS,
- UI sederhana untuk operator non-teknis,
- struktur modular dan scalable,
- aman secara akses per role,
- siap migrasi dari Sheets ke database SQL di masa depan,
- tersedia backup dan restore sederhana,
- seluruh kalkulasi konsisten antara frontend dan backend.

## 1.10 Business Rules
- satu RS hanya dapat mengakses datanya sendiri,
- satu periode dapat dibuka atau ditutup oleh admin pusat,
- hanya laporan dengan status `APPROVED` yang masuk dashboard final default,
- draft tidak muncul di dashboard eksekutif kecuali mode monitoring internal,
- periode yang sudah `LOCKED` tidak dapat diedit,
- data numerik disimpan sebagai angka mentah, tampilan rupiah hanya di UI.

## 1.11 KPI Keberhasilan Produk
- 90% RS mengisi tepat waktu,
- waktu rekap pusat turun signifikan,
- error format/input menurun,
- semua perubahan data memiliki audit trail,
- data monitoring tersedia real-time.

## 1.12 Risiko
- keterbatasan Google Sheets untuk skala sangat besar,
- performa Apps Script saat trafik tinggi,
- autentikasi sederhana jika hanya pakai Sheets,
- potensi konflik edit jika banyak user mengubah data simultan.

## 1.13 Acceptance Criteria MVP
Produk dianggap siap MVP jika:
- user dapat login sesuai role,
- admin pusat dapat mengelola RS dan periode,
- admin RS dapat input dan submit data PNBP/BLU,
- dashboard monitoring tampil dan bisa difilter,
- approval/revisi berjalan,
- audit trail tersimpan,
- export dasar berfungsi.
