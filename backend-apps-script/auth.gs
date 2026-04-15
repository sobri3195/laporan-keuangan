function loginHandler(payload) {
  requireFields(payload, ['email', 'password']);
  var users = readRows('users');
  var user = users.filter(function(u) { return u.email === payload.email; })[0];
  if (!user) throw new Error('Invalid credentials');
  var token = uuid();
  appendRow('system_configs', ['SESSION', token, user.id, nowIso()]);
  return { token: token, user: user };
}

function meHandler(token) {
  var users = readRows('users');
  var sessions = readRows('system_configs').filter(function(c) { return c.key === 'SESSION' && c.value === token; });
  if (!sessions.length) throw new Error('Session not found');
  var userId = sessions[0].meta;
  return users.filter(function(u) { return u.id === userId; })[0];
}
