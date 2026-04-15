function getSheet(name) {
  var ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error('Sheet not found: ' + name);
  return sheet;
}

function readRows(name) {
  var rows = getSheet(name).getDataRange().getValues();
  if (rows.length < 2) return [];
  var headers = rows[0];
  return rows.slice(1).map(function(r) {
    var obj = {};
    headers.forEach(function(h, idx) { obj[h] = r[idx]; });
    return obj;
  });
}

function appendRow(name, row) {
  getSheet(name).appendRow(row);
}
