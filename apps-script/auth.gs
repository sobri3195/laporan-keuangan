function listSessions() {
  return readRows('system_configs').filter(function(cfg) { return cfg.key === 'SESSION'; });
}

function loginHandler(payload) {
  requireFields(payload, ['email', 'password']);
  var users = readRows('users');
  var user = users.filter(function(u) {
    return String(u.email).toLowerCase() === String(payload.email).toLowerCase() && boolValue(u.is_active, true);
  })[0];

  if (!user) throw new Error('Invalid credentials');

  var storedPassword = user.password || 'simon123';
  if (storedPassword !== payload.password) throw new Error('Invalid credentials');

  var token = uuid();
  appendObject('system_configs', {
    key: 'SESSION',
    value: token,
    meta: JSON.stringify({ user_id: user.id, expired_at: new Date(Date.now() + CONFIG.TOKEN_EXPIRY_HOURS * 3600000).toISOString() }),
    updated_at: nowIso()
  });

  return { token: token, user: user };
}

function meHandler(token) {
  if (!token) throw new Error('Unauthorized');
  var sessions = listSessions();
  var session = sessions.filter(function(s) { return s.value === token; })[0];
  if (!session) throw new Error('Session not found');

  var parsed = session.meta ? JSON.parse(session.meta) : {};
  if (parsed.expired_at && new Date(parsed.expired_at).getTime() < Date.now()) {
    throw new Error('Session expired');
  }

  var user = readRows('users').filter(function(u) { return u.id === parsed.user_id; })[0];
  return assertExists(user, 'User not found');
}
