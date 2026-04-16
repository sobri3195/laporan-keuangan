# Tutorial Integrasi File Excel (XLS/XLSX) dengan Google Apps Script ke Google Sheets

Panduan ini menjelaskan cara menerima file Excel (`.xls`/`.xlsx`) lalu mengimpor isinya ke Google Sheets menggunakan Google Apps Script.

> Catatan penting: Google Sheets **lebih stabil untuk `.xlsx`**. File `.xls` lama (Excel 97-2003) sebaiknya dikonversi dulu ke `.xlsx` agar hasil impor lebih konsisten.

---

## 1) Prasyarat

Pastikan Anda sudah punya:

1. Akun Google.
2. Satu Google Spreadsheet tujuan (sheet database Anda).
3. Project Google Apps Script yang terhubung ke spreadsheet.
4. Akses untuk mengaktifkan **Google Drive API** (advanced service).

---

## 2) Arsitektur Alur (Ringkas)

Alur yang kita buat:

1. User unggah file Excel ke Google Drive (manual atau via form).
2. Apps Script membaca file tersebut.
3. Apps Script mengonversi file Excel menjadi Google Spreadsheet sementara.
4. Data dari sheet sementara disalin ke sheet target Anda.
5. File sementara bisa dihapus agar Drive tetap rapi.

---

## 3) Setup Project Apps Script

1. Buka spreadsheet tujuan.
2. Klik **Extensions → Apps Script**.
3. Buat file script baru, misalnya `excelImport.gs`.
4. Aktifkan **Services**:
   - Di editor Apps Script, klik ikon **+** di bagian *Services*.
   - Tambahkan **Drive API**.
5. Simpan project.

---

## 4) Konfigurasi Dasar

Salin konfigurasi ini lalu sesuaikan nama sheet Anda.

```javascript
const EXCEL_IMPORT_CONFIG = {
  targetSpreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
  targetSheetName: 'report_submissions', // ganti dengan sheet tujuan
  headerRow: 1,
};
```

Jika Anda ingin mengisi spreadsheet lain, ganti `targetSpreadsheetId` dengan ID spreadsheet tujuan.

---

## 5) Script Utama Import XLS/XLSX

Salin kode berikut ke Apps Script:

```javascript
/**
 * Import file Excel dari Drive ke sheet target.
 * @param {string} fileId ID file Excel di Google Drive
 */
function importExcelToSheet(fileId) {
  const config = EXCEL_IMPORT_CONFIG;

  // 1) Ambil file Excel dari Drive
  const excelFile = DriveApp.getFileById(fileId);

  // 2) Konversi Excel -> Google Spreadsheet sementara
  const blob = excelFile.getBlob();
  const resource = {
    title: `[TMP] ${excelFile.getName()}`,
    mimeType: MimeType.GOOGLE_SHEETS,
  };

  // Drive advanced service
  const tempSpreadsheetFile = Drive.Files.insert(resource, blob, {
    convert: true,
  });

  const tempSpreadsheetId = tempSpreadsheetFile.id;

  try {
    // 3) Baca sheet pertama dari file hasil konversi
    const tempSs = SpreadsheetApp.openById(tempSpreadsheetId);
    const sourceSheet = tempSs.getSheets()[0];
    const sourceValues = sourceSheet.getDataRange().getValues();

    if (!sourceValues || sourceValues.length === 0) {
      throw new Error('File Excel kosong atau tidak ada data.');
    }

    // 4) Buka sheet target
    const targetSs = SpreadsheetApp.openById(config.targetSpreadsheetId);
    const targetSheet = targetSs.getSheetByName(config.targetSheetName);

    if (!targetSheet) {
      throw new Error(`Sheet target '${config.targetSheetName}' tidak ditemukan.`);
    }

    // Opsional: bersihkan data lama (sisakan header)
    clearSheetKeepHeader_(targetSheet, config.headerRow);

    // 5) Tulis data baru ke sheet target
    targetSheet
      .getRange(config.headerRow, 1, sourceValues.length, sourceValues[0].length)
      .setValues(sourceValues);

    Logger.log('Import Excel selesai.');
  } finally {
    // 6) Hapus file sementara agar Drive bersih
    DriveApp.getFileById(tempSpreadsheetId).setTrashed(true);
  }
}

/**
 * Hapus isi sheet mulai setelah baris header.
 */
function clearSheetKeepHeader_(sheet, headerRow) {
  const maxRows = sheet.getMaxRows();
  const maxCols = sheet.getMaxColumns();
  const startRow = headerRow + 1;

  if (maxRows >= startRow) {
    sheet.getRange(startRow, 1, maxRows - headerRow, maxCols).clearContent();
  }
}
```

---

## 6) Cara Menjalankan

### Opsi A — Manual (paling cepat)

1. Upload file Excel ke Google Drive.
2. Ambil `fileId` dari URL Drive.
   - Contoh URL: `https://drive.google.com/file/d/FILE_ID/view`
3. Jalankan function berikut sekali dari editor:

```javascript
function runImportManual() {
  const fileId = 'GANTI_DENGAN_FILE_ID_EXCEL';
  importExcelToSheet(fileId);
}
```

4. Saat pertama kali jalan, berikan izin akses Apps Script.

### Opsi B — via Web App endpoint

Anda bisa buat endpoint `doPost(e)` untuk menerima `fileId` dari frontend, lalu panggil `importExcelToSheet(fileId)`.

---

## 7) Mapping Kolom (Sangat Disarankan)

Agar aman saat struktur Excel berubah, gunakan mapping berdasarkan nama header, bukan posisi kolom.

Contoh pendekatan:

1. Baca header baris 1 dari source.
2. Buat map `namaHeader -> indexKolom`.
3. Isi baris output sesuai urutan kolom di sheet target.

Ini penting untuk kasus pengguna mengubah urutan kolom di file Excel.

---

## 8) Validasi Data Sebelum Simpan

Tambahkan validasi agar data tidak kotor:

- Kolom wajib tidak boleh kosong.
- Tipe angka harus valid (`Number(...)`).
- Tanggal harus bisa diparse.
- Jika ada error, log detail baris dan kolom.

Contoh aturan cepat:

```javascript
function isRowValid_(row) {
  // contoh: kolom 1 (kode RS) dan kolom 2 (periode) wajib
  return row[0] && row[1];
}
```

---

## 9) Troubleshooting Umum

### Error: `Drive is not defined` atau `Drive.Files.insert is not a function`
- Pastikan **Drive API** advanced service sudah diaktifkan di Apps Script project.

### Data berantakan setelah impor
- Cek file sumber menggunakan format `.xlsx`.
- Cek merged cell / formula aneh / hidden column di Excel.
- Terapkan mapping header (bagian 7).

### Sheet target tidak ditemukan
- Cek `targetSpreadsheetId` dan `targetSheetName`.

### Gagal izin akses
- Jalankan function manual dari editor sekali untuk memicu layar authorization.

---

## 10) Rekomendasi untuk Integrasi ke Sistem Anda

Karena repo ini berbasis Apps Script + Google Sheets, praktik aman yang disarankan:

1. Buat service khusus, misalnya `excelImportService.gs`.
2. Simpan log import ke `audit_logs` (jumlah baris sukses/gagal).
3. Validasi user role sebelum mengizinkan import.
4. Batasi ukuran file (misal maksimal 10 MB).
5. Simpan ringkasan hasil import ke notifikasi admin.

---

## 11) Template Service (Siap Tempel ke Arsitektur Modular)

```javascript
const ExcelImportService = {
  importByFileId(fileId) {
    importExcelToSheet(fileId);
    return {
      success: true,
      message: 'Import XLS/XLSX berhasil.',
      importedAt: new Date().toISOString(),
    };
  },
};
```

Template ini bisa Anda panggil dari `router.gs` sesuai endpoint internal Anda.

---

## 12) Checklist Implementasi

- [ ] Drive API advanced service aktif.
- [ ] Nama sheet target sudah benar.
- [ ] Function import berhasil untuk 1 file contoh.
- [ ] Validasi baris diterapkan.
- [ ] Audit log import tercatat.
- [ ] Hak akses import dibatasi role tertentu.

---

Jika Anda mau, langkah berikutnya saya bisa bantu buatkan versi **langsung cocok dengan struktur file `apps-script/` di repo ini** (router + service + response format yang sudah ada), jadi tinggal copy-paste dan deploy.
