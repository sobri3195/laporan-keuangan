function logAudit(userId, action, entity, entityId, beforeData, afterData) {
  return appendObject('audit_logs', {
    id: uuid(),
    timestamp: nowIso(),
    actor_user_id: userId || '',
    action: action || '',
    entity: entity || '',
    entity_id: entityId || '',
    before_json: JSON.stringify(beforeData || null),
    after_json: JSON.stringify(afterData || null)
  });
}

function listAuditLogs() { return readRows('audit_logs'); }
