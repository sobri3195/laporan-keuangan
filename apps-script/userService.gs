function listUsers() {
  return readRows('users');
}

function createUser(payload) {
  requireFields(payload, ['full_name', 'email', 'role']);
  var user = {
    id: payload.id || uuid(),
    full_name: payload.full_name,
    email: String(payload.email).toLowerCase(),
    role: payload.role,
    hospital_id: payload.hospital_id || '',
    is_active: boolValue(payload.is_active, true),
    created_at: nowIso(),
    updated_at: nowIso(),
    password: payload.password || 'simon123'
  };
  appendObject('users', user);
  return user;
}

function updateUser(id, payload) {
  var result = updateFirst('users', function(row) { return row.id === id; }, function(row) {
    row.full_name = payload.full_name || row.full_name;
    row.email = payload.email ? String(payload.email).toLowerCase() : row.email;
    row.role = payload.role || row.role;
    row.hospital_id = payload.hospital_id !== undefined ? payload.hospital_id : row.hospital_id;
    row.is_active = payload.is_active !== undefined ? boolValue(payload.is_active, row.is_active) : row.is_active;
    if (payload.password) row.password = payload.password;
    row.updated_at = nowIso();
    return row;
  });
  assertExists(result, 'User not found');
  return result.after;
}
