function listUsers() { return readRows('users'); }
function createUser(payload) { requireFields(payload, ['id', 'email', 'role']); appendRow('users', [payload.id, payload.full_name, payload.email, payload.role, payload.hospital_id]); return payload; }
function updateUser(id, payload) { return { id: id, updated: true, payload: payload }; }
