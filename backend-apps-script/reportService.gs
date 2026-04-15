function calcPNBP(payload) {
  var sisa = payload.pendapatan - payload.pengeluaran;
  var aset = sisa + payload.piutang + payload.persediaan;
  return {
    sisa_saldo: sisa,
    aset_lancar: aset,
    ekuitas: aset - payload.hutang,
    current_ratio: safeDiv(aset, payload.hutang),
    cash_ratio: safeDiv(sisa, payload.hutang)
  };
}

function calcBLU(payload) {
  var sisa = payload.saldo_awal + payload.pendapatan - payload.pengeluaran;
  var aset = sisa + payload.piutang + payload.persediaan;
  return {
    sisa_saldo_akhir: sisa,
    aset_lancar: aset,
    ekuitas: aset - payload.hutang,
    current_ratio: safeDiv(aset, payload.hutang),
    cash_ratio: safeDiv(sisa, payload.hutang)
  };
}

function listReports() { return readRows('report_submissions'); }
function getReportById(id) { return listReports().filter(function(r) { return r.id === id; })[0]; }
function submitReport(id) { return { id: id, status: 'SUBMITTED' }; }
function approveReport(id) { return { id: id, status: 'APPROVED' }; }
function requestRevision(id, note) { return { id: id, status: 'REVISION_REQUESTED', note: note }; }
