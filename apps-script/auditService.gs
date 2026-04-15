function logAudit(userId, action, entity, entityId, beforeData, afterData) {
  appendRow('audit_logs', [uuid(), nowIso(), userId, action, entity, entityId, JSON.stringify(beforeData || null), JSON.stringify(afterData || null)]);
}

function listAuditLogs() { return readRows('audit_logs'); }
