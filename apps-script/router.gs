function routeRequest(method, path, payload, token) {
  if (method === 'POST' && path === '/auth/login') return loginHandler(payload);
  if (method === 'GET' && path === '/auth/me') return meHandler(token);

  if (method === 'GET' && path === '/hospitals') return listHospitals();
  if (method === 'POST' && path === '/hospitals') return createHospital(payload);
  if (method === 'GET' && path === '/users') return readRows('users');
  if (method === 'POST' && path === '/users') return payload;
  if (method === 'GET' && path === '/periods') return listPeriods();
  if (method === 'POST' && path === '/periods') return createPeriod(payload);

  if (method === 'GET' && path === '/reports') return listReports();
  if (method === 'GET' && path.indexOf('/reports/') === 0) return getReportById(path.split('/')[2]);
  if (method === 'POST' && path === '/reports/pnbp') return calcPNBP(payload);
  if (method === 'POST' && path === '/reports/blu') return calcBLU(payload);

  if (method === 'POST' && path.indexOf('/submit') > -1) return submitReport(path.split('/')[2]);
  if (method === 'POST' && path.indexOf('/approve') > -1) return approveReport(path.split('/')[2]);
  if (method === 'POST' && path.indexOf('/request-revision') > -1) return requestRevision(path.split('/')[2], payload.note);

  if (method === 'GET' && path === '/dashboard/summary') return dashboardSummary();
  if (method === 'GET' && path === '/dashboard/trends') return dashboardTrends();
  if (method === 'GET' && path === '/dashboard/rankings') return dashboardRankings();

  if (method === 'GET' && path === '/monitoring/compliance') return monitoringCompliance();
  if (method === 'GET' && path === '/notifications') return listNotifications();
  if (method === 'GET' && path === '/audit-logs') return listAuditLogs();
  if (method === 'GET' && path === '/exports/reports') return { url: 'TODO_EXPORT_HANDLER' };

  throw new Error('Route not found');
}
