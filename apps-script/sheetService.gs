function getSpreadsheet() {
  if (!CONFIG.SHEET_ID || CONFIG.SHEET_ID.indexOf('TODO_') === 0) {
    throw new Error('CONFIG.SHEET_ID belum diatur');
  }
  return SpreadsheetApp.openById(CONFIG.SHEET_ID);
}

function getSheet(name) {
  var sheet = getSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Sheet not found: ' + name);
  return sheet;
}

function createSheetIfMissing(name) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function ensureHeader(name) {
  var headers = CONFIG.HEADER_MAP[name];
  if (!headers || !headers.length) throw new Error('Header config not found: ' + name);
  var sheet = createSheetIfMissing(name);
  var range = sheet.getRange(1, 1, 1, headers.length);
  var current = range.getValues()[0];
  var needsUpdate = headers.some(function(h, i) { return String(current[i] || '') !== h; });
  if (needsUpdate) {
    range.setValues([headers]);
  }
  return headers;
}

function initWorkbook() {
  Object.keys(CONFIG.HEADER_MAP).forEach(function(name) {
    ensureHeader(name);
  });
  return { initialized: true, sheetCount: Object.keys(CONFIG.HEADER_MAP).length };
}

function readRows(name) {
  var headers = ensureHeader(name);
  var rows = getSheet(name).getDataRange().getValues();
  if (rows.length < 2) return [];
  return rows.slice(1).filter(function(row) {
    return row.some(function(cell) { return cell !== '' && cell !== null; });
  }).map(function(row) {
    var obj = {};
    headers.forEach(function(h, idx) { obj[h] = row[idx]; });
    return obj;
  });
}

function appendObject(name, obj) {
  var headers = ensureHeader(name);
  var row = headers.map(function(h) { return obj[h] !== undefined ? obj[h] : ''; });
  getSheet(name).appendRow(row);
  return obj;
}

function overwriteRows(name, rows) {
  var headers = ensureHeader(name);
  var sheet = getSheet(name);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (!rows.length) return;
  var values = rows.map(function(obj) {
    return headers.map(function(h) { return obj[h] !== undefined ? obj[h] : ''; });
  });
  sheet.getRange(2, 1, values.length, headers.length).setValues(values);
}

function updateFirst(name, predicateFn, updaterFn) {
  var rows = readRows(name);
  var index = -1;
  for (var i = 0; i < rows.length; i++) {
    if (predicateFn(rows[i])) {
      index = i;
      break;
    }
  }
  if (index < 0) return null;

  var before = JSON.parse(JSON.stringify(rows[index]));
  var updated = updaterFn(rows[index]) || rows[index];
  rows[index] = updated;
  overwriteRows(name, rows);
  return { before: before, after: updated };
}
