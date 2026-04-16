function doGet(e) {
  try {
    var path = e.parameter.path || '/';
    var token = e.parameter.token || '';
    var data = routeRequest('GET', path, {}, token);
    return jsonResponse(true, data, null);
  } catch (err) {
    return jsonResponse(false, null, err.message);
  }
}

function doPost(e) {
  try {
    var payload = parseBody(e);
    var path = payload.path || '/';
    var method = (payload.method || 'POST').toUpperCase();
    var token = payload.token || '';
    var data = routeRequest(method, path, payload.data || {}, token);
    return jsonResponse(true, data, null);
  } catch (err) {
    return jsonResponse(false, null, err.message);
  }
}
