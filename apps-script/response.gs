function jsonResponse(success, data, message) {
  return ContentService.createTextOutput(JSON.stringify({ success: success, data: data || null, message: message || null })).setMimeType(ContentService.MimeType.JSON);
}
