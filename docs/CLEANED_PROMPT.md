# Prompt Bersih — SIMON Keuangan RS

Buat web app monitoring laporan keuangan rumah sakit untuk pelaporan **PNBP/BLU** per periode **bulanan/triwulanan/tahunan**.

## Stack
- Frontend: React + Vite + Tailwind
- Form: React Hook Form + Zod
- State: Zustand/Context
- Chart: Recharts/Chart.js
- Backend API ringan: Google Apps Script (Web App)
- Database: Google Sheets
- Deployment frontend: Vercel

## Role
- Admin Pusat
- Admin RS
- Viewer/Pimpinan

## Tujuan
- Mengganti Excel manual menjadi input online terpusat
- Monitoring real-time unit yang sudah/belum lapor
- Dashboard analitik ringkas
- Mengurangi error, duplikasi, dan keterlambatan
- Menyediakan audit trail perubahan data

## Modul Wajib
1. Login + RBAC (remember session, route guard, unauthorized)
2. Master data (RS, user, periode)
3. Form PNBP dan BLU dengan kalkulasi otomatis + validasi
4. Dashboard monitoring + filter + indikator warna status
5. Monitoring kepatuhan pelaporan (tabel status seluruh RS)
6. Approval/revisi workflow (Draft → Submitted → Reviewed → Approved/Revisi)
7. Laporan dan ekspor (Excel/CSV/PDF/print)
8. Notifikasi (in-app + email Apps Script)
9. Data quality checks (duplikasi, ekstrem, rasio invalid, anomali)
10. Audit trail lengkap

## Integrasi Google Sheets (minimum sheet)
- users
- master_rs
- periode
- laporan_pnbp
- laporan_blu
- audit_log
- notifications

## Endpoint Apps Script (minimum)
- POST /login
- GET /master-rs
- GET /periode
- GET /dashboard-summary
- GET /laporan
- GET /laporan/:id
- POST /laporan-pnbp
- POST /laporan-blu
- PUT /laporan-pnbp/:id
- PUT /laporan-blu/:id
- POST /submit/:id
- POST /approve/:id
- POST /revisi/:id
- GET /monitoring-status
- GET /audit-log
- GET /export

## Output yang Diminta
- Struktur folder React + Vite
- Halaman/komponen utama sesuai modul
- Integrasi frontend ↔ Apps Script API
- Contoh script backend Apps Script
- Struktur Google Sheets
- Alur login/session
- Validasi form + dashboard chart + monitoring table
- Role-based access
- Panduan deployment Vercel + Apps Script
- README lengkap + dummy data

## Catatan Pembersihan
- Duplikasi blok prompt panjang yang sama telah dihapus.
- Hanya menyisakan satu versi prompt yang konsisten.
