function listPeriods() {
  return readRows('periods');
}

function createPeriod(payload) {
  requireFields(payload, ['label', 'year', 'month', 'start_date', 'end_date']);
  var period = {
    id: payload.id || uuid(),
    label: payload.label,
    year: payload.year,
    month: payload.month,
    start_date: payload.start_date,
    end_date: payload.end_date,
    is_locked: boolValue(payload.is_locked, false),
    is_active: boolValue(payload.is_active, true)
  };
  appendObject('periods', period);
  return period;
}

function updatePeriod(id, payload) {
  var result = updateFirst('periods', function(row) { return row.id === id; }, function(row) {
    row.label = payload.label || row.label;
    row.year = payload.year || row.year;
    row.month = payload.month || row.month;
    row.start_date = payload.start_date || row.start_date;
    row.end_date = payload.end_date || row.end_date;
    row.is_locked = payload.is_locked !== undefined ? boolValue(payload.is_locked, row.is_locked) : row.is_locked;
    row.is_active = payload.is_active !== undefined ? boolValue(payload.is_active, row.is_active) : row.is_active;
    return row;
  });

  assertExists(result, 'Period not found');
  return result.after;
}
