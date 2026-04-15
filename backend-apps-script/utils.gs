function nowIso() { return new Date().toISOString(); }
function uuid() { return Utilities.getUuid(); }
function parseBody(e) { return e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {}; }
function safeDiv(a, b) { return b > 0 ? a / b : null; }
