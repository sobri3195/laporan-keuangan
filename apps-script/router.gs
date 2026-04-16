function routeRequest(method, path, payload, token) {
  var clean = cleanPath(path);

  if (method === 'POST' && clean === '/setup/init') return initWorkbook();
  if (method === 'POST' && clean === '/setup/seed-hospitals') return seedHospitalsFromTemplate();

  if (method === 'POST' && clean === '/auth/login') return loginHandler(payload);
  if (method === 'GET' && clean === '/auth/me') return meHandler(token);

  if (method === 'GET' && clean === '/hospitals') return listHospitals();
  if (method === 'POST' && clean === '/hospitals') return createHospital(payload);
  if (method === 'PUT' && clean.indexOf('/hospitals/') === 0) return updateHospital(clean.split('/')[2], payload);

  if (method === 'GET' && clean === '/users') return listUsers();
  if (method === 'POST' && clean === '/users') return createUser(payload);
  if (method === 'PUT' && clean.indexOf('/users/') === 0) return updateUser(clean.split('/')[2], payload);

  if (method === 'GET' && clean === '/periods') return listPeriods();
  if (method === 'POST' && clean === '/periods') return createPeriod(payload);
  if (method === 'PUT' && clean.indexOf('/periods/') === 0) return updatePeriod(clean.split('/')[2], payload);

  if (method === 'GET' && clean === '/reports') return listReports();
  if (method === 'GET' && clean.indexOf('/reports/') === 0) return getReportById(clean.split('/')[2]);
  if (method === 'POST' && clean === '/reports/pnbp') return createPnbpReport(payload);
  if (method === 'POST' && clean === '/reports/blu') return createBluReport(payload);

  if (method === 'POST' && clean.indexOf('/submit') > -1) return submitReport(clean.split('/')[2]);
  if (method === 'POST' && clean.indexOf('/approve') > -1) return approveReport(clean.split('/')[2]);
  if (method === 'POST' && clean.indexOf('/request-revision') > -1) {
    return requestRevision(clean.split('/')[2], payload.note, payload.reviewer_id);
  }

  if (method === 'GET' && clean === '/dashboard/summary') return dashboardSummary();
  if (method === 'GET' && clean === '/dashboard/trends') return dashboardTrends();
  if (method === 'GET' && clean === '/dashboard/rankings') return dashboardRankings();

  if (method === 'GET' && clean === '/monitoring/compliance') return monitoringCompliance();
  if (method === 'GET' && clean === '/notifications') return listNotifications();
  if (method === 'GET' && clean === '/audit-logs') return listAuditLogs();
  if (method === 'GET' && clean === '/exports/reports') return { url: 'TODO_EXPORT_HANDLER' };

  throw new Error('Route not found: ' + method + ' ' + clean);
}
