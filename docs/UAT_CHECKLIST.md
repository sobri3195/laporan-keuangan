# UAT Checklist

## Auth & Access
- [ ] Login per role berhasil.
- [ ] Protected route redirect jika belum login.
- [ ] ADMIN_RS hanya melihat data RS sendiri.

## Master Data
- [ ] CRUD hospitals/users/periods.
- [ ] Period locked tidak bisa diubah.

## Report
- [ ] Buat Draft PNBP/BLU.
- [ ] Submit, approve, revision flow berjalan.
- [ ] Formula ratio menampilkan `N/A` saat divisor <= 0.
- [ ] Duplicate report prevention aktif.

## Monitoring & Dashboard
- [ ] KPI cards tampil.
- [ ] Trend/ranking/chart tampil.
- [ ] Draft tidak masuk executive default.

## Governance
- [ ] Audit log tercatat untuk operasi penting.
- [ ] Notifikasi tercipta untuk event submit/revision/approve.
