# 3) TSD — Technical Specification Document

## 3.1 Arsitektur Umum

Arsitektur yang dipakai adalah **frontend SPA + backend ringan via Apps Script + Google Sheets sebagai storage**.

### Layer 1 — Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Zustand
- React Hook Form
- Zod
- Recharts

### Layer 2 — API Layer
- Google Apps Script Web App
- REST-like endpoints
- validasi server-side
- kalkulasi dan workflow state handling
- koneksi ke Google Sheets
- integrasi ke Gmail/Drive bila perlu

### Layer 3 — Storage
- Google Sheets
- Google Drive untuk file attachment
- optional PropertiesService untuk config rahasia ringan

## 3.2 Arsitektur Modul Frontend

### App Shell
- Sidebar
- Header
- Protected Layout
- Public Layout

### Auth Module
- login form
- session handling
- route guard
- role permission

### Master Data Module
- RS management
- user management
- period management

### Reporting Module
- create/edit report
- save draft
- submit
- revision flow
- detail report

### Dashboard Module
- KPI cards
- charts
- filters
- benchmarks
- anomaly indicators

### Monitoring Module
- tabel status pelaporan
- completeness
- invalid data
- overdue submit

### Notification Module
- notification bell
- dropdown
- mark as read

### Audit Module
- activity list
- change history
- filter by user / action / date

## 3.3 Arsitektur Backend Apps Script

Gunakan pola modular di Apps Script:

- `router.gs`
- `auth.gs`
- `sheetService.gs`
- `reportService.gs`
- `dashboardService.gs`
- `validation.gs`
- `auditService.gs`
- `notificationService.gs`
- `response.gs`
- `utils.gs`

### Tanggung jawab utama

#### router
- membaca method dan path
- dispatch ke service yang tepat

#### auth
- login
- session token validation
- role authorization

#### sheetService
- baca/tulis data dari setiap sheet
- helper pencarian row
- helper update row by ID

#### reportService
- create report
- update draft
- submit
- approve
- request revision
- recalculate metrics

#### dashboardService
- agregasi KPI
- generate data chart
- monitoring compliance

#### validation
- validasi schema input
- business rule validation

#### auditService
- simpan perubahan ke `audit_logs`

#### notificationService
- create notification
- email via MailApp/GmailApp

## 3.4 Data Flow

### Flow Input Draft
1. Admin RS login.
2. Ambil master periode aktif dan profil RS.
3. User isi form.
4. Frontend validasi.
5. Frontend kirim ke Apps Script.
6. Backend validasi ulang.
7. Backend hitung field turunan.
8. Data disimpan ke `report_submissions` dan detail.
9. Audit log dibuat.
10. Respons sukses dikirim ke frontend.

### Flow Submit Final
1. User klik submit.
2. Backend cek kelengkapan dan validitas.
3. Status menjadi `SUBMITTED`.
4. `submitted_at` diisi.
5. Notifikasi admin pusat dibuat.
6. Audit log dibuat.

### Flow Review
1. Admin pusat buka daftar submitted.
2. Lihat detail.
3. Pilih approve atau revisi.
4. Status diperbarui.
5. Notifikasi dikirim ke admin RS.
6. Audit log dibuat.

### Flow Dashboard
1. Frontend request dashboard summary.
2. Backend baca data approved/submitted sesuai filter.
3. Backend hitung agregat.
4. Frontend render KPI dan chart.

## 3.5 Formula Bisnis

### PNBP
- `sisa_saldo = pendapatan - pengeluaran`
- `aset_lancar = sisa_saldo + piutang + persediaan`
- `ekuitas = aset_lancar - hutang`
- `current_ratio = hutang > 0 ? aset_lancar / hutang : null`
- `cash_ratio = hutang > 0 ? sisa_saldo / hutang : null`

### BLU
- `sisa_saldo_akhir = saldo_awal + pendapatan - pengeluaran`
- `aset_lancar = sisa_saldo_akhir + piutang + persediaan`
- `ekuitas = aset_lancar - hutang`
- `current_ratio = hutang > 0 ? aset_lancar / hutang : null`
- `cash_ratio = hutang > 0 ? sisa_saldo_akhir / hutang : null`

### Catatan penting
- field kosong tetap `null`
- jangan fallback ke `0` tanpa alasan bisnis
- rasio dengan pembagi nol harus `null` dan ditampilkan `N/A`

## 3.6 API Contract

### Auth
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Master Data
- `GET /hospitals`
- `POST /hospitals`
- `PUT /hospitals/:id`
- `GET /users`
- `POST /users`
- `PUT /users/:id`
- `GET /periods`
- `POST /periods`
- `PUT /periods/:id`

### Reports
- `GET /reports`
- `GET /reports/:id`
- `POST /reports/pnbp`
- `PUT /reports/pnbp/:id`
- `POST /reports/blu`
- `PUT /reports/blu/:id`
- `POST /reports/:id/submit`
- `POST /reports/:id/approve`
- `POST /reports/:id/request-revision`

### Dashboard
- `GET /dashboard/summary`
- `GET /dashboard/trends`
- `GET /dashboard/rankings`
- `GET /monitoring/compliance`

### Others
- `GET /notifications`
- `POST /notifications/:id/read`
- `GET /audit-logs`
- `GET /exports/reports`

## 3.7 Frontend State Design

### State utama
- `authStore`
- `periodStore`
- `filterStore`
- `reportStore`
- `dashboardStore`
- `notificationStore`

### Data yang sebaiknya global
- current user
- active period
- sidebar state
- dashboard filters
- notification count

## 3.8 Security Design

Untuk fase awal:
- password di-hash
- token session sederhana
- token dikirim via header `Authorization`
- endpoint cek role
- sanitasi input
- whitelist fields update
- audit semua aksi penting
- CORS dibatasi ke domain Vercel

## 3.9 Desain Teknis untuk Fitur Lanjutan

### A. Form completeness dan status submit
- Tambahkan metadata `required_fields` per template form.
- Backend hitung `completion_percent` + `filled_count/required_count` saat save draft.
- Endpoint submit menolak request bila `completion_percent < 100` atau validasi gagal.

### B. Freeze periode pasca deadline
- Tambahkan state period: `OPEN`, `CLOSED`, `LOCKED`.
- Scheduler (time-driven trigger Apps Script) mengecek period lewat deadline untuk auto-close.
- Lock final dilakukan ketika semua syarat approval tercapai.

### C. Multi-level approval workflow
- Gunakan tabel konfigurasi `approval_stages`:
  - `stage_order`
  - `role`
  - `is_required`
- Tambahkan `current_stage` pada submission.
- Action approval menggeser ke stage berikutnya hingga final `APPROVED`.

### D. Komentar per field
- Tambahkan tabel `field_comments` dengan kolom:
  - `submission_id`
  - `field_key`
  - `comment_text`
  - `status`
  - `created_by`
  - `resolved_by`
- Frontend form menampilkan badge komentar per field.

### E. Rule engine anomali ringan
- Tambahkan service `anomalyService` dengan rule berbasis threshold.
- Simpan konfigurasi threshold di `system_configs`.
- Struktur output rule:
  - `rule_code`
  - `severity`
  - `message`
  - `metric_value`
  - `threshold`

### F. Rekap wilayah
- Tambahkan atribut `region_code` pada master RS.
- Agregasi dashboard mendukung `groupBy=region|hospital`.
- Endpoint monitoring menambahkan statistik kepatuhan per wilayah.

### G. Deadline dashboard
- Tambahkan utilitas `getDeadlineState(now, deadline_at)` yang mengembalikan:
  - `ON_TRACK`
  - `DUE_TODAY`
  - `OVERDUE`
- Frontend menampilkan countdown real-time berbasis tanggal period aktif.

### H. Draft vs final segregation
- Pisahkan query:
  - `reports/drafts` untuk operator
  - `reports/final` untuk dashboard pusat
- Semua endpoint agregasi KPI default membaca data final-only.

### I. Import Excel
- Tambahkan endpoint `POST /imports/reports/excel`.
- Proses:
  1. Validasi format file/template.
  2. Parsing sheet.
  3. Validasi per baris/kolom.
  4. Upsert ke draft.
  5. Return ringkasan sukses/gagal.

### J. API readiness dan migrasi backend
- Definisikan interface repository generik:
  - `UserRepository`
  - `HospitalRepository`
  - `PeriodRepository`
  - `ReportRepository`
- Implementasi awal `SheetsRepositoryAdapter`.
- Siapkan adapter target:
  - `PostgresRepositoryAdapter`
  - `SupabaseRepositoryAdapter`
  - `FirebaseRepositoryAdapter`

Catatan:
Jika nanti sistem berkembang, autentikasi sebaiknya dipindah ke yang lebih kuat, misalnya Firebase Auth, Supabase Auth, atau SSO.

## 3.9 Performance Considerations
- cache master data di frontend
- paginasi untuk tabel besar
- agregasi dashboard dilakukan di backend
- hindari baca seluruh sheet untuk setiap request
- simpan index row by ID jika perlu
- buat sheet archival jika data makin besar
- pertimbangkan summary sheet untuk dashboard cepat

## 3.10 Error Handling

### Standar response sukses

```json
{
  "success": true,
  "message": "Data berhasil disimpan",
  "data": {}
}
```

### Saat gagal

```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "pendapatan": "Pendapatan wajib diisi"
  }
}
```

Frontend harus menangani:
- loading
- empty state
- error state
- retry state

## 3.11 Logging & Monitoring
- audit aksi user
- log error backend
- log request penting
- dashboard health minimal untuk admin
- optional webhook error ke email admin

## 3.12 Testing Strategy

### Frontend
- unit test util dan validation
- component test untuk form dan table
- smoke test navigation

### Backend
- test per endpoint utama
- test validasi bisnis
- test kalkulasi formula
- test workflow status

### UAT
- login role-based
- create/edit/submit report
- approve/revisi
- dashboard sesuai angka
- export berjalan

## 3.13 Deployment

### Frontend
- deploy ke Vercel
- env:
  - `VITE_API_BASE_URL`
  - `VITE_APP_NAME`

### Backend
- Apps Script deploy as Web App
- akses: sesuai kebutuhan domain/publik terbatas
- simpan Spreadsheet ID di script properties

### Storage
- Google Spreadsheet utama
- Google Drive folder untuk lampiran

---

# 4) Development Stage

## Stage 0 — Discovery & Alignment

### Output
- finalisasi kebutuhan
- daftar role
- daftar field final
- definisi workflow
- definisi dashboard KPI
- persetujuan desain data

### Deliverables
- PRD final
- schema final
- wireframe kasar
- timeline sprint

## Stage 1 — Foundation Setup

### Fokus
- inisialisasi React + Vite
- setup Tailwind
- setup router
- setup state management
- setup Apps Script project
- setup spreadsheet schema

### Deliverables
- project boilerplate
- autentikasi dasar
- folder structure
- base API client
- spreadsheet siap pakai

## Stage 2 — Authentication & Master Data

### Fokus
- login/logout
- protected routes
- CRUD hospitals
- CRUD users
- CRUD periods

### Deliverables
- halaman login
- manajemen RS
- manajemen user
- manajemen periode
- role-based access aktif

## Stage 3 — Report Input Module

### Fokus
- form PNBP
- form BLU
- save draft
- edit draft
- hitung field otomatis
- validasi input

### Deliverables
- halaman input laporan
- autosave atau save draft
- response validasi yang jelas
- penyimpanan ke sheet

## Stage 4 — Workflow Review

### Fokus
- submit final
- approve
- request revision
- timeline activity
- revision comments

### Deliverables
- halaman review admin pusat
- status flow berjalan
- notifikasi dasar
- histori revisi

## Stage 5 — Dashboard & Monitoring

### Fokus
- KPI dashboard
- tren per periode
- ranking RS
- monitoring submit
- overdue indicators
- anomaly flags

### Deliverables
- dashboard admin pusat
- dashboard RS
- tabel monitoring
- filter lengkap

## Stage 6 — Reporting & Export

### Fokus
- export Excel/CSV
- print layout
- laporan ringkasan
- laporan keterlambatan

### Deliverables
- report module
- export endpoints
- print-friendly pages

## Stage 7 — Audit, Notifications, Hardening

### Fokus
- audit logs
- notifikasi email
- in-app notifications
- security review
- performance improvement

### Deliverables
- audit page
- notification center
- error handling rapi
- stabilisasi sistem

## Stage 8 — UAT & Go Live

### Fokus
- user acceptance test
- bug fixing
- final seed data
- training user
- deployment production

### Deliverables
- release candidate
- UAT checklist
- user manual
- go-live package

## Rekomendasi sprint

Jika tim kecil:
- Sprint 1: Foundation + Auth + Master Data
- Sprint 2: Report Input
- Sprint 3: Workflow + Dashboard
- Sprint 4: Export + Audit + Hardening + UAT

---

# 5) Project Structure Template

Berikut template struktur proyek yang cocok untuk React + Vite + Vercel.

```text
simon-keuangan-rs/
├── public/
│   ├── favicon.ico
│   └── logo.png
│
├── src/
│   ├── app/
│   │   ├── router/
│   │   │   ├── index.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── RoleGuard.tsx
│   │   ├── providers/
│   │   │   ├── AppProvider.tsx
│   │   │   └── QueryProvider.tsx
│   │   └── layouts/
│   │       ├── AppLayout.tsx
│   │       ├── AuthLayout.tsx
│   │       └── DashboardLayout.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── KPIStatCard.tsx
│   │   │   ├── TrendLineChart.tsx
│   │   │   ├── RankingBarChart.tsx
│   │   │   ├── StatusPieChart.tsx
│   │   │   └── ComplianceHeatmap.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── CurrencyInput.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── PNBPReportForm.tsx
│   │   │   └── BLUReportForm.tsx
│   │   │
│   │   ├── tables/
│   │   │   ├── MonitoringTable.tsx
│   │   │   ├── ReportsTable.tsx
│   │   │   ├── AuditLogTable.tsx
│   │   │   └── HospitalsTable.tsx
│   │   │
│   │   └── common/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── PageTitle.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorState.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── hooks.ts
│   │   │   ├── types.ts
│   │   │   └── validation.ts
│   │   │
│   │   ├── hospitals/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   └── validation.ts
│   │   │
│   │   ├── periods/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   └── validation.ts
│   │   │
│   │   ├── reports/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   ├── selectors.ts
│   │   │   ├── calculations.ts
│   │   │   └── validation.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   └── mappers.ts
│   │   │
│   │   ├── monitoring/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   └── filters.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   └── types.ts
│   │   │
│   │   └── audit/
│   │       ├── api.ts
│   │       ├── store.ts
│   │       └── types.ts
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── ExecutiveDashboardPage.tsx
│   │   ├── reports/
│   │   │   ├── ReportsListPage.tsx
│   │   │   ├── ReportDetailPage.tsx
│   │   │   ├── CreatePNBPReportPage.tsx
│   │   │   ├── CreateBLUReportPage.tsx
│   │   │   └── EditReportPage.tsx
│   │   ├── monitoring/
│   │   │   └── MonitoringPage.tsx
│   │   ├── master/
│   │   │   ├── HospitalsPage.tsx
│   │   │   ├── UsersPage.tsx
│   │   │   └── PeriodsPage.tsx
│   │   ├── audit/
│   │   │   └── AuditLogsPage.tsx
│   │   ├── notifications/
│   │   │   └── NotificationsPage.tsx
│   │   └── settings/
│   │       └── ProfilePage.tsx
│   │
│   ├── services/
│   │   ├── apiClient.ts
│   │   ├── authToken.ts
│   │   ├── errorHandler.ts
│   │   └── download.ts
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useDisclosure.ts
│   │   ├── useCurrentUser.ts
│   │   └── useActivePeriod.ts
│   │
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── permissions.ts
│   │   ├── date.ts
│   │   ├── currency.ts
│   │   ├── number.ts
│   │   ├── status.ts
│   │   └── env.ts
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── hospital.ts
│   │   ├── period.ts
│   │   ├── report.ts
│   │   ├── dashboard.ts
│   │   ├── notification.ts
│   │   └── audit.ts
│   │
│   ├── styles/
│   │   ├── index.css
│   │   └── utilities.css
│   │
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── apps-script/
│   ├── appsscript.json
│   ├── main.gs
│   ├── router.gs
│   ├── auth.gs
│   ├── response.gs
│   ├── utils.gs
│   ├── validators.gs
│   ├── sheetService.gs
│   ├── hospitalService.gs
│   ├── periodService.gs
│   ├── reportService.gs
│   ├── dashboardService.gs
│   ├── monitoringService.gs
│   ├── auditService.gs
│   ├── notificationService.gs
│   └── config.gs
│
├── docs/
│   ├── PRD.md
│   ├── DATABASE_SCHEMA.md
│   ├── TSD.md
│   ├── API_SPEC.md
│   ├── UAT_CHECKLIST.md
│   └── DEPLOYMENT_GUIDE.md
│
├── .env.example
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── README.md
```

## 5.1 Struktur Apps Script yang disarankan

### `main.gs`
- Entry point `doGet` dan `doPost`.

### `router.gs`
- Parser endpoint dan dispatcher.

### `auth.gs`
- login user
- validasi token
- cek role

### `sheetService.gs`
- `getSheetByName`
- `getAllRows`
- `findRowById`
- `insertRow`
- `updateRowById`
- `softDelete`

### `validators.gs`
- validasi payload
- validasi angka
- validasi status workflow

### `reportService.gs`
- `createPNBPReport`
- `updatePNBPReport`
- `createBLUReport`
- `updateBLUReport`
- `submitReport`
- `approveReport`
- `requestRevision`

### `dashboardService.gs`
- `getSummary`
- `getTrends`
- `getRankings`
- `getComplianceMatrix`

### `auditService.gs`
- `logAction`
- `getAuditLogs`

### `notificationService.gs`
- `createNotification`
- `sendEmailNotification`

## 5.2 Naming convention

Gunakan konvensi berikut:
- komponen React: `PascalCase`
- hooks: `useXxx`
- util: `camelCase`
- file types: `*.types.ts`
- validation: `*.validation.ts`
- API wrapper: `*.api.ts`

## 5.3 Environment variables

Frontend `.env`:

```dotenv
VITE_APP_NAME=SIMON Keuangan RS
VITE_API_BASE_URL=https://script.google.com/macros/s/xxxxx/exec
VITE_ENABLE_DEBUG=false
```

## 5.4 Template README ringkas

README minimal berisi:
- deskripsi aplikasi
- stack teknologi
- cara install
- cara run lokal
- env variables
- deployment Vercel
- deployment Apps Script
- struktur folder
- user roles
- daftar endpoint
- screenshot
