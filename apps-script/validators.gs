function requireFields(payload, fields) {
  for (var i = 0; i < fields.length; i++) {
    if (payload[fields[i]] === undefined || payload[fields[i]] === null) throw new Error('Missing field: ' + fields[i]);
  }
}

function assertRole(user, allowed) {
  if (allowed.indexOf(user.role) === -1) throw new Error('Unauthorized role');
}
