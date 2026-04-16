function dashboardSummary() {
  var reports = listReports();
  var submitted = reports.filter(function(r) { return r.status === 'SUBMITTED'; }).length;
  var approved = reports.filter(function(r) { return r.status === 'APPROVED'; }).length;
  var revision = reports.filter(function(r) { return r.status === 'REVISION_REQUESTED'; }).length;

  return {
    totalReports: reports.length,
    submitted: submitted,
    approved: approved,
    revisionRequested: revision
  };
}

function dashboardTrends() {
  var reports = listReports();
  var bucket = {};

  reports.forEach(function(r) {
    var period = r.period_id || 'UNKNOWN';
    if (!bucket[period]) bucket[period] = { period: period, submitted: 0, approved: 0 };
    if (r.status === 'SUBMITTED') bucket[period].submitted += 1;
    if (r.status === 'APPROVED') bucket[period].approved += 1;
  });

  return Object.keys(bucket).sort().map(function(key) { return bucket[key]; });
}

function dashboardRankings() {
  var reports = listReports();
  var scoreMap = {};

  reports.forEach(function(r) {
    var key = r.hospital_id || 'UNKNOWN';
    if (!scoreMap[key]) scoreMap[key] = { hospitalId: key, score: 0, approvedCount: 0 };
    if (r.status === 'APPROVED') {
      scoreMap[key].score += 100;
      scoreMap[key].approvedCount += 1;
    } else if (r.status === 'SUBMITTED') {
      scoreMap[key].score += 60;
    }
  });

  return Object.keys(scoreMap)
    .map(function(k) { return scoreMap[k]; })
    .sort(function(a, b) { return b.score - a.score; })
    .slice(0, 10);
}
