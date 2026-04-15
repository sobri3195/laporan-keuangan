function listHospitals() { return readRows('hospitals'); }
function createHospital(payload) { requireFields(payload, ['id', 'code', 'name']); appendRow('hospitals', [payload.id, payload.code, payload.name, payload.province, true]); return payload; }
function updateHospital(id, payload) { return { id: id, updated: true, payload: payload }; }
