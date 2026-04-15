# Deployment Guide

## Frontend (Vercel)
1. Import repository ke Vercel.
2. Root directory: `frontend`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Set env `VITE_API_BASE_URL` ke URL Apps Script Web App.

## Apps Script
1. Buat Apps Script project dan copy file dari `backend-apps-script`.
2. Set `CONFIG.SHEET_ID`.
3. Deploy > New Deployment > Web App.
4. Execute as: Me, Access: sesuai kebutuhan organisasi.
5. Simpan deployment URL untuk frontend.

## Google Sheets Setup
- Buat workbook dan 11 sheet sesuai `docs/DATABASE_SCHEMA.md`.
- Isi header sesuai kolom.
- Seed awal users/hospitals/periods.
