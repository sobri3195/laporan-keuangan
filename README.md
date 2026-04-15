# SIMON Keuangan RS

SIMON Keuangan RS (Sistem Monitoring Laporan Keuangan Rumah Sakit) adalah fondasi aplikasi produksi untuk pelaporan PNBP/BLU berbasis React + Google Apps Script + Google Sheets.

## Struktur Monorepo
- `frontend/`: React + Vite + TypeScript + Tailwind.
- `backend-apps-script/`: endpoint Apps Script modular.
- `docs/`: PRD, schema, TSD, API, deployment, UAT.

## Fitur Inti
- Login + protected route + role-based access (`ADMIN_PUSAT`, `ADMIN_RS`, `VIEWER`).
- Master data: hospitals, users, periods.
- Report lifecycle: draft, submit, review, revision, approval.
- Dashboard KPI, trend, ranking, anomali, monitoring compliance.
- Notification dan audit logs.
- Formula PNBP/BLU dengan safe divide (`N/A` jika pembagi nol).

## Quick Start
1. Copy `.env.example` to `.env`.
2. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3. Backend Apps Script:
   - Buat Apps Script project.
   - Copy semua file `.gs` dari `backend-apps-script/`.
   - Isi `CONFIG.SHEET_ID`.
   - Deploy Web App.

## Demo Login (Frontend Mock)
- Email: gunakan salah satu user pada `frontend/src/mocks/seedData.ts`:
  - `pusat@simon.go.id`
  - `harapan@simon.go.id`
  - `sehat@simon.go.id`
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

## Limitations & Future Migration
- Google Sheets tidak ideal untuk volume sangat besar dan transaksi paralel tinggi.
- Session/token di Apps Script masih sederhana, perlu hardening (JWT/OAuth SSO).
- Export/attachment masih placeholder fondasi.
- Rencana migrasi: pindah ke SQL backend (PostgreSQL/MySQL) + service API terpisah untuk concurrency, indexing, dan audit integrity lebih kuat.
