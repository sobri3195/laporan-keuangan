function listPeriods() { return readRows('periods'); }
function createPeriod(payload) { requireFields(payload, ['id', 'label']); appendRow('periods', [payload.id, payload.label, payload.year, payload.month, false, true]); return payload; }
function updatePeriod(id, payload) { return { id: id, updated: true, payload: payload }; }
