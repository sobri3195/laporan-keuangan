function listHospitals() {
  return readRows('hospitals');
}

function createHospital(payload) {
  requireFields(payload, ['code', 'name']);
  var hospital = {
    id: payload.id || uuid(),
    code: payload.code,
    name: payload.name,
    province: payload.province || '',
    city: payload.city || '',
    class_type: payload.class_type || '',
    active: boolValue(payload.active, true),
    created_at: nowIso(),
    updated_at: nowIso()
  };
  appendObject('hospitals', hospital);
  return hospital;
}

function updateHospital(id, payload) {
  var result = updateFirst('hospitals', function(row) { return row.id === id; }, function(row) {
    row.code = payload.code || row.code;
    row.name = payload.name || row.name;
    row.province = payload.province !== undefined ? payload.province : row.province;
    row.city = payload.city !== undefined ? payload.city : row.city;
    row.class_type = payload.class_type !== undefined ? payload.class_type : row.class_type;
    row.active = payload.active !== undefined ? boolValue(payload.active, row.active) : row.active;
    row.updated_at = nowIso();
    return row;
  });

  assertExists(result, 'Hospital not found');
  return result.after;
}

function seedHospitalsFromTemplate() {
  var existing = listHospitals();
  if (existing.length) return { inserted: 0, skipped: existing.length };

  CONFIG.HOSPITAL_SEED_PNBP_2026_Q1.forEach(function(name, idx) {
    createHospital({
      code: 'RSAU-' + Utilities.formatString('%03d', idx + 1),
      name: name,
      province: '',
      city: '',
      class_type: ''
    });
  });

  return { inserted: CONFIG.HOSPITAL_SEED_PNBP_2026_Q1.length, skipped: 0 };
}
