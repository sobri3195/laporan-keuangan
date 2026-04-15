function monitoringCompliance() {
  return listReports().map(function(r) {
    return { hospitalId: r.hospital_id, periodId: r.period_id, status: r.status, completeness: r.completeness_score, validity: r.validity_score };
  });
}
