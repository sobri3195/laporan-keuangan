# SIMON Keuangan RS

SIMON Keuangan RS (Sistem Monitoring Laporan Keuangan Rumah Sakit) adalah fondasi aplikasi produksi untuk pelaporan PNBP/BLU berbasis React + Google Apps Script + Google Sheets.

## Struktur Monorepo
- `frontend/`: React + Vite + TypeScript + Tailwind.
- `apps-script/`: endpoint Apps Script modular.
- `docs/`: PRD, schema, TSD, API, deployment, UAT.

## Fitur Inti
- Login + remember session (persisted) + protected route + role-based access (`ADMIN_PUSAT`, `ADMIN_RS`, `VIEWER`).
- Master data: hospitals, users, periods.
- Report lifecycle: draft, submit, review, revision, approval.
- Dashboard KPI, trend, ranking, anomali, monitoring compliance.
- Notification dan audit logs.
- Formula PNBP/BLU dengan safe divide (`N/A` jika pembagi nol), autosave draft form, warning validasi rasio hutang=0, dan upload lampiran opsional.

## Quick Start
1. Copy `.env.example` to `.env`.
2. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3. Backend Apps Script:
   - Buat Apps Script project.
   - Copy semua file `.gs` dari `apps-script/`.
   - Isi `CONFIG.SHEET_ID`.
   - Deploy Web App.

## Demo Login (Frontend Mock)
- Email: gunakan salah satu user pada `frontend/src/mocks/seedData.ts`:
  - `pusat@simon.go.id`
  - `efram@simon.go.id`
  - `charles@simon.go.id`
  - `viewer@simon.go.id`
- Password (semua akun demo): `simon123`

## Data Model (Google Sheets)
Buat sheet:
- users
- hospitals
- periods
- report_submissions
- report_pnbp_details
- report_blu_details
- revision_comments
- audit_logs
- notifications
- attachments
- system_configs

## Catatan
- Placeholder `TODO_*` hanya untuk kredensial/deployment eksternal.
- Seed frontend ada di `frontend/src/mocks/seedData.ts`.

## Troubleshooting Browser Console Error
Jika muncul error seperti berikut di browser console:
- `TypeError: Cannot read properties of null (reading 'querySelector')` dari URL `chrome-extension://...`
- `Uncaught SyntaxError: Unexpected token 'export'` dari URL `chrome-extension://...`

Kemungkinan besar sumbernya adalah **extension browser**, bukan kode aplikasi SIMON. Langkah verifikasi cepat:
1. Buka aplikasi pada mode Incognito dengan extension nonaktif.
2. Atau nonaktifkan extension satu per satu lalu refresh aplikasi.
3. Pastikan error berasal dari domain aplikasi (`http://localhost:5173`/domain deploy) jika ingin ditindaklanjuti sebagai bug aplikasi.

Selama stack trace menunjuk ke `chrome-extension://...`, error tersebut umumnya aman diabaikan untuk fungsionalitas inti aplikasi.

## Limitations & Future Migration
- Google Sheets tidak ideal untuk volume sangat besar dan transaksi paralel tinggi.
- Session/token di Apps Script masih sederhana, perlu hardening (JWT/OAuth SSO).
- Export/attachment masih placeholder fondasi.
- Rencana migrasi: pindah ke SQL backend (PostgreSQL/MySQL) + service API terpisah untuk concurrency, indexing, dan audit integrity lebih kuat.
