function calcPNBP(payload) {
  var pendapatan = toNumber(payload.pendapatan);
  var pengeluaran = toNumber(payload.pengeluaran);
  var piutang = toNumber(payload.piutang);
  var persediaan = toNumber(payload.persediaan);
  var hutang = toNumber(payload.hutang);

  var sisa = pendapatan - pengeluaran;
  var aset = sisa + piutang + persediaan;
  return {
    pendapatan: pendapatan,
    pengeluaran: pengeluaran,
    sisa_saldo: sisa,
    piutang: piutang,
    persediaan: persediaan,
    aset_lancar: aset,
    hutang: hutang,
    ekuitas: aset - hutang,
    current_ratio: safeDiv(aset, hutang),
    cash_ratio: safeDiv(sisa, hutang)
  };
}

function calcBLU(payload) {
  var saldoAwal = toNumber(payload.saldo_awal);
  var pendapatan = toNumber(payload.pendapatan);
  var pengeluaran = toNumber(payload.pengeluaran);
  var piutang = toNumber(payload.piutang);
  var persediaan = toNumber(payload.persediaan);
  var hutang = toNumber(payload.hutang);

  var sisa = saldoAwal + pendapatan - pengeluaran;
  var aset = sisa + piutang + persediaan;
  return {
    saldo_awal: saldoAwal,
    pendapatan: pendapatan,
    pengeluaran: pengeluaran,
    sisa_saldo_akhir: sisa,
    piutang: piutang,
    persediaan: persediaan,
    aset_lancar: aset,
    hutang: hutang,
    ekuitas: aset - hutang,
    current_ratio: safeDiv(aset, hutang),
    cash_ratio: safeDiv(sisa, hutang)
  };
}

function listReports() {
  return readRows('report_submissions');
}

function getReportById(id) {
  return listReports().filter(function(r) { return r.id === id; })[0];
}

function upsertReportSubmission(payload) {
  requireFields(payload, ['hospital_id', 'period_id', 'entity_type']);
  var reports = listReports();
  var found = reports.filter(function(r) {
    return r.hospital_id === payload.hospital_id && r.period_id === payload.period_id && r.entity_type === payload.entity_type;
  })[0];

  if (found) return found;

  var report = {
    id: uuid(),
    hospital_id: payload.hospital_id,
    period_id: payload.period_id,
    entity_type: payload.entity_type,
    status: CONFIG.DEFAULT_REPORT_STATUS,
    completeness_score: payload.completeness_score || 0,
    validity_score: payload.validity_score || 0,
    anomaly_flags_json: payload.anomaly_flags_json || '[]',
    submitted_at: '',
    approved_at: '',
    updated_at: nowIso()
  };
  appendObject('report_submissions', report);
  return report;
}

function createPnbpReport(payload) {
  var report = upsertReportSubmission(payload);
  var computed = calcPNBP(payload);
  var row = { report_id: report.id };
  Object.keys(computed).forEach(function(key) { row[key] = computed[key]; });
  appendObject('report_pnbp_details', row);
  return { submission: report, details: row };
}

function createBluReport(payload) {
  var report = upsertReportSubmission(payload);
  var computed = calcBLU(payload);
  var row = { report_id: report.id };
  Object.keys(computed).forEach(function(key) { row[key] = computed[key]; });
  appendObject('report_blu_details', row);
  return { submission: report, details: row };
}

function submitReport(id) {
  var result = updateFirst('report_submissions', function(r) { return r.id === id; }, function(r) {
    r.status = 'SUBMITTED';
    r.submitted_at = nowIso();
    r.updated_at = nowIso();
    return r;
  });
  assertExists(result, 'Report not found');
  return result.after;
}

function approveReport(id) {
  var result = updateFirst('report_submissions', function(r) { return r.id === id; }, function(r) {
    r.status = 'APPROVED';
    r.approved_at = nowIso();
    r.updated_at = nowIso();
    return r;
  });
  assertExists(result, 'Report not found');
  return result.after;
}

function requestRevision(id, note, reviewerId) {
  var result = updateFirst('report_submissions', function(r) { return r.id === id; }, function(r) {
    r.status = 'REVISION_REQUESTED';
    r.updated_at = nowIso();
    return r;
  });
  assertExists(result, 'Report not found');

  appendObject('revision_comments', {
    id: uuid(),
    report_id: id,
    reviewer_id: reviewerId || '',
    comment: note || 'Mohon revisi data',
    created_at: nowIso()
  });

  return result.after;
}

function getReportsExportUrl() {
  var reportSheet = getSheet('report_submissions');
  var gid = reportSheet.getSheetId();
  var spreadsheetId = CONFIG.SHEET_ID;
  var downloadUrl = 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/export?format=xlsx&gid=' + gid;

  return {
    spreadsheet_id: spreadsheetId,
    sheet_name: 'report_submissions',
    download_url: downloadUrl
  };
}
