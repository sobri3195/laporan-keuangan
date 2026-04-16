function requireFields(payload, fields) {
  for (var i = 0; i < fields.length; i++) {
    if (payload[fields[i]] === undefined || payload[fields[i]] === null || payload[fields[i]] === '') {
      throw new Error('Missing field: ' + fields[i]);
    }
  }
}

function assertRole(user, allowed) {
  if (!user || allowed.indexOf(user.role) === -1) throw new Error('Unauthorized role');
}

function assertExists(data, message) {
  if (!data) throw new Error(message || 'Data not found');
  return data;
}
