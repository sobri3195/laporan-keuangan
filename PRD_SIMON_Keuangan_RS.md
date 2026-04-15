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

## 2. Database Scheme
Karena stack yang dipilih adalah Google Sheets, gunakan logical relational schema berikut. Secara implementasi, tiap tabel menjadi satu sheet.

### 2.1 Prinsip desain
- semua record punya id unik,
- gunakan UUID string,
- hindari formula bisnis inti di sheet,
- kalkulasi utama dilakukan di backend/frontend,
- sheet hanya menjadi storage final,
- gunakan lookup ringan untuk master,
- audit log dipisah dari tabel transaksi.

### 2.2 Tabel `users`
Menyimpan akun pengguna.

`users`
- `id`: string (PK)
- `username`: string (unique)
- `password_hash`: string
- `full_name`: string
- `email`: string
- `role`: enum(`ADMIN_PUSAT`, `ADMIN_RS`, `VIEWER`)
- `rs_id`: string | null
- `is_active`: boolean
- `last_login_at`: datetime | null
- `created_at`: datetime
- `created_by`: string
- `updated_at`: datetime
- `updated_by`: string

Catatan:
- `rs_id` wajib untuk `ADMIN_RS`,
- `rs_id` boleh `null` untuk `ADMIN_PUSAT` dan `VIEWER` pusat.

### 2.3 Tabel `hospitals`
Master rumah sakit/faskes.

`hospitals`
- `id`: string (PK)
- `code`: string (unique)
- `name`: string
- `entity_type`: enum(`PNBP`, `BLU`)
- `classification`: string
- `region`: string
- `command_unit`: string
- `city`: string
- `is_active`: boolean
- `created_at`: datetime
- `created_by`: string
- `updated_at`: datetime
- `updated_by`: string

### 2.4 Tabel `periods`
Master periode pelaporan.

`periods`
- `id`: string (PK)
- `year`: number
- `period_type`: enum(`BULANAN`, `TRIWULANAN`, `SEMESTER`, `TAHUNAN`)
- `period_number`: number
- `label`: string
- `start_date`: date
- `end_date`: date
- `deadline_at`: datetime
- `is_open`: boolean
- `is_locked`: boolean
- `created_at`: datetime
- `created_by`: string
- `updated_at`: datetime
- `updated_by`: string

Contoh:
- `TRIWULANAN`, `1`, `TW I 2026`

### 2.5 Tabel `report_submissions`
Header laporan untuk kedua jenis laporan.

`report_submissions`
- `id`: string (PK)
- `period_id`: string (FK -> `periods.id`)
- `rs_id`: string (FK -> `hospitals.id`)
- `entity_type`: enum(`PNBP`, `BLU`)
- `status`: enum(`DRAFT`, `SUBMITTED`, `IN_REVIEW`, `REVISION_REQUESTED`, `APPROVED`, `LOCKED`)
- `completeness_score`: number
- `validity_score`: number
- `anomaly_flags_json`: string
- `revision_count`: number
- `submitted_at`: datetime | null
- `approved_at`: datetime | null
- `approved_by`: string | null
- `revision_requested_at`: datetime | null
- `revision_note`: string | null
- `is_active_version`: boolean
- `created_at`: datetime
- `created_by`: string
- `updated_at`: datetime
- `updated_by`: string

Kenapa perlu tabel header?
- supaya workflow, audit, dan status tidak tercampur dengan isi angka laporan.

### 2.6 Tabel `report_pnbp_details`
Detail angka untuk laporan PNBP.

`report_pnbp_details`
- `id`: string (PK)
- `submission_id`: string (FK -> `report_submissions.id`, unique)
- `pendapatan`: number | null
- `pengeluaran`: number | null
- `piutang`: number | null
- `persediaan`: number | null
- `hutang`: number | null
- `sisa_saldo`: number | null
- `aset_lancar`: number | null
- `ekuitas`: number | null
- `current_ratio`: number | null
- `cash_ratio`: number | null
- `notes`: string | null
- `created_at`: datetime
- `updated_at`: datetime

### 2.7 Tabel `report_blu_details`
Detail angka untuk laporan BLU.

`report_blu_details`
- `id`: string (PK)
- `submission_id`: string (FK -> `report_submissions.id`, unique)
- `saldo_awal`: number | null
- `pendapatan`: number | null
- `pengeluaran`: number | null
- `piutang`: number | null
- `persediaan`: number | null
- `hutang`: number | null
- `sisa_saldo_akhir`: number | null
- `aset_lancar`: number | null
- `ekuitas`: number | null
- `current_ratio`: number | null
- `cash_ratio`: number | null
- `notes`: string | null
- `created_at`: datetime
- `updated_at`: datetime

### 2.8 Tabel `revision_comments`
Komentar revisi dari admin pusat.

`revision_comments`
- `id`: string (PK)
- `submission_id`: string (FK -> `report_submissions.id`)
- `comment_scope`: enum(`GENERAL`, `FIELD`)
- `field_name`: string | null
- `comment_text`: string
- `created_by`: string
- `created_at`: datetime

### 2.9 Tabel `audit_logs`
Audit trail sistem.

`audit_logs`
- `id`: string (PK)
- `entity_name`: string
- `entity_id`: string
- `action`: enum(`CREATE`, `UPDATE`, `DELETE`, `SUBMIT`, `APPROVE`, `REQUEST_REVISION`, `LOGIN`, `LOGOUT`, `LOCK`)
- `actor_id`: string
- `actor_name`: string
- `old_value_json`: string | null
- `new_value_json`: string | null
- `metadata_json`: string | null
- `created_at`: datetime

### 2.10 Tabel `notifications`
Notifikasi in-app.

`notifications`
- `id`: string (PK)
- `user_id`: string (FK -> `users.id`)
- `title`: string
- `message`: string
- `type`: enum(`INFO`, `WARNING`, `SUCCESS`, `ERROR`)
- `is_read`: boolean
- `created_at`: datetime
- `read_at`: datetime | null

### 2.11 Tabel `attachments`
Untuk lampiran pendukung.

`attachments`
- `id`: string (PK)
- `submission_id`: string (FK -> `report_submissions.id`)
- `file_name`: string
- `file_url`: string
- `mime_type`: string
- `uploaded_by`: string
- `uploaded_at`: datetime

Catatan:
- lampiran dapat disimpan di Google Drive, sedangkan URL-nya disimpan di sheet.

### 2.12 Tabel `system_configs`
Konfigurasi global.

`system_configs`
- `key`: string (PK)
- `value`: string
- `description`: string | null
- `updated_at`: datetime
- `updated_by`: string

Contoh `key`:
- `APP_NAME`
- `DEFAULT_PERIOD_ID`
- `ALLOW_EDIT_AFTER_SUBMIT`
- `EMAIL_NOTIFICATIONS_ENABLED`

### 2.13 Relasi utama
- `users.rs_id` -> `hospitals.id`
- `report_submissions.period_id` -> `periods.id`
- `report_submissions.rs_id` -> `hospitals.id`
- `report_pnbp_details.submission_id` -> `report_submissions.id`
- `report_blu_details.submission_id` -> `report_submissions.id`
- `revision_comments.submission_id` -> `report_submissions.id`
- `attachments.submission_id` -> `report_submissions.id`
- `notifications.user_id` -> `users.id`

### 2.14 Constraint penting
- kombinasi `period_id + rs_id + entity_type + is_active_version=true` harus unik,
- `submission_id` hanya boleh punya satu detail PNBP atau satu detail BLU,
- `entity_type=PNBP` hanya boleh dipasangkan dengan `report_pnbp_details`,
- `entity_type=BLU` hanya boleh dipasangkan dengan `report_blu_details`.
