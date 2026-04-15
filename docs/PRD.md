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
