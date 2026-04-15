function dashboardSummary() { return { totalReports: listReports().length, approved: listReports().filter(function(r){return r.status==='APPROVED';}).length }; }
function dashboardTrends() { return [{ period: '2026-01', submitted: 20, approved: 15 }]; }
function dashboardRankings() { return [{ hospitalId: 'H1', score: 98 }, { hospitalId: 'H2', score: 90 }]; }
