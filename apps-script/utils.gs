function nowIso() { return new Date().toISOString(); }
function uuid() { return Utilities.getUuid(); }

function parseBody(e) {
  return e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
}

function toNumber(value) {
  var n = Number(value);
  return isNaN(n) ? 0 : n;
}

function safeDiv(a, b) {
  var denominator = toNumber(b);
  if (denominator <= 0) return null;
  return toNumber(a) / denominator;
}

function cleanPath(path) {
  if (!path) return '/';
  return String(path).split('?')[0];
}

function boolValue(value, fallback) {
  if (value === true || value === false) return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}
