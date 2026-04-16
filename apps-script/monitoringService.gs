function monitoringCompliance() {
  return listReports().map(function(r) {
    return {
      hospitalId: r.hospital_id,
      periodId: r.period_id,
      entityType: r.entity_type,
      status: r.status,
      completeness: Number(r.completeness_score || 0),
      validity: Number(r.validity_score || 0),
      isCompliant: r.status === 'APPROVED'
    };
  });
}
