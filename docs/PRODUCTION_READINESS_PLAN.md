# Production Readiness Plan — SIMON Keuangan RS

Dokumen ini merapikan daftar gap yang Anda kirim menjadi **rencana eksekusi yang bisa dijalankan** (aksi teknis, output artefak, dan indikator selesai).

## Ringkasan Prioritas

| Prioritas | Fokus | Target Waktu |
|---|---|---|
| P0 (segera) | Keamanan login, CI quality gate minimum, observability dasar, runbook insiden | 2–4 minggu |
| P1 (menengah) | Migrasi database relasional, backup-restore, queue/retry, release management | 1–2 kuartal |
| P2 (lanjutan) | DR penuh, hardening export/attachment skala besar, notifikasi multi-channel | 2+ kuartal |

## 1) Keamanan & Akses

### Kondisi Saat Ini
- Autentikasi masih berbasis session token sederhana.
- Secret belum terpusat.
- Belum ada kebijakan anti brute-force yang formal.

### Rencana Perbaikan
1. **Hardening autentikasi**
   - Target: OAuth2/OIDC + SSO (IdP enterprise), atau JWT signed dengan key rotation.
   - Deliverable: dokumen arsitektur auth + playbook rotasi key.
2. **Centralized secret management**
   - Target: secret di Secret Manager/Vault, bukan hardcoded.
   - Deliverable: inventory secret + SOP rotasi berkala (mis. 90 hari).
3. **Proteksi brute force login**
   - Target: rate limiting per identitas login dan lockout sementara.
   - Deliverable: guard login, metric jumlah gagal login, alert anomali.
4. **Audit keamanan berkala**
   - Target: security review triwulanan + pentest minimal 2x/tahun.
   - Deliverable: laporan temuan + tracking remediation.

## 2) Reliability Backend

### Kondisi Saat Ini
- Operasional kritikal masih bergantung Google Sheets.
- Mekanisme retry/queue belum terstandar.

### Rencana Perbaikan
1. **Kurangi ketergantungan Sheets untuk jalur kritis**
   - Target: jalur transaksi utama dipindah ke service + DB relasional.
2. **Queue + retry standar**
   - Target: background jobs untuk export, notifikasi, sinkronisasi.
   - Deliverable: retry policy (exponential backoff + dead-letter queue).
3. **Backup/restore terotomasi**
   - Target: backup harian + uji restore berkala (minimal bulanan).
4. **Disaster Recovery**
   - Target: dokumen RTO/RPO per layanan + simulasi DR semesteran.

## 3) Data & Integritas

### Kondisi Saat Ini
- Konsistensi lintas-sheet rentan pada akses paralel.
- Belum ada data retention policy formal.

### Rencana Perbaikan
1. **Migrasi ke PostgreSQL/MySQL**
   - Target: schema normalized + constraint + index + transaksi ACID.
2. **Validasi data lintas entitas**
   - Target: enforce di level service + database constraint.
3. **Data retention policy**
   - Target: klasifikasi masa simpan (aktif, arsip, purge).
4. **Data quality monitoring**
   - Target: SLA kualitas data (kelengkapan, keakuratan, ketepatan waktu).

## 4) Observability & Operasional

### Kondisi Saat Ini
- Logging/tracing belum terpusat end-to-end.
- Alert dan dashboard belum terstruktur penuh.

### Rencana Perbaikan
1. **Centralized logging + tracing**
   - Target: log terstruktur, correlation-id, tracing request lintas komponen.
2. **Alerting operasional**
   - Target: alert berbasis threshold + burn-rate SLO.
3. **Dashboard health real-time**
   - Target: panel admin untuk latency, error rate, queue lag, submit failure.
4. **Runbook insiden**
   - Target: SOP untuk skenario major incident + template postmortem.

## 5) Testing & Quality Gate

### Kondisi Saat Ini
- Belum ada quality gate CI yang memaksa semua jenis tes utama.

### Rencana Perbaikan
1. **Standar minimum automated tests**
   - Target: unit + integration + e2e dengan ambang minimal.
2. **Coverage target + gate merge/deploy**
   - Target: merge ditolak jika coverage/tes gagal.
3. **Load test periodik**
   - Target: simulasi puncak pelaporan bulanan/kuartalan.
4. **Versioned API contract tests**
   - Target: mencegah breaking change antarkomponen.

## 6) DevOps & Deployment

### Kondisi Saat Ini
- Pipeline dan strategi release belum baku end-to-end.

### Rencana Perbaikan
1. **Pipeline CI/CD penuh**
   - Target: lint, test, build, deploy terotomasi per environment.
2. **Versioning + release notes baku**
   - Target: semantic versioning + changelog otomatis.
3. **Pemisahan environment tegas**
   - Target: dev/staging/prod dengan konfigurasi terdokumentasi.
4. **Rollback plan otomatis**
   - Target: canary/blue-green + fallback cepat saat error naik.

## 7) Fitur Produk Placeholder

### Kondisi Saat Ini
- Export dan attachment masih fondasi.
- Notifikasi multichannel dan eskalasi belum otomatis.

### Rencana Perbaikan
1. **Hardening export skala besar**
   - Target: streaming/chunking + proteksi memory.
2. **Hardening upload attachment**
   - Target: validasi tipe file, ukuran, antivirus scan, signed URL.
3. **Notifikasi multichannel**
   - Target: email/WA dengan retry + delivery tracking.
4. **Workflow eskalasi otomatis**
   - Target: rule engine keterlambatan + reminder bertahap.

## 8) Tata Kelola & Kepatuhan

### Kondisi Saat Ini
- Governance akses dan kepatuhan belum terdokumentasi lengkap.

### Rencana Perbaikan
1. **Matriks hak akses formal**
   - Target: RBAC matrix + proses approval perubahan akses.
2. **Klasifikasi data sensitif + masking**
   - Target: PII tagging + masking di log dan tampilan.
3. **SOP audit trail eksternal**
   - Target: alur pengambilan bukti audit yang repeatable.
4. **Dokumen SLA/SLO resmi**
   - Target: kesepakatan lintas tim (produk, engineering, operasi).

## Quick Wins yang sudah bisa diterapkan sekarang

1. Terapkan rate limiting login + lockout sementara untuk mengurangi brute-force.
2. Tambahkan log keamanan untuk percobaan login gagal.
3. Tegakkan quality gate minimal di CI: lint + unit test wajib lulus.
4. Susun runbook insiden versi awal (v1) untuk 3 skenario utama: login gagal massal, submit timeout, export gagal.

## Definisi Selesai (Definition of Done)

Setiap item dianggap selesai jika:
- Sudah ada implementasi teknis.
- Sudah ada dokumen operasional/SOP terkait.
- Sudah ada metrik/alert untuk memverifikasi berjalan di produksi.
- Sudah diuji (test/pilot/simulasi) dan ada bukti eksekusi.
