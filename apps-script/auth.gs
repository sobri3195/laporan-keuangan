function listSessions() {
  return readRows('system_configs').filter(function(cfg) { return cfg.key === 'SESSION'; });
}

function getAuthCache() {
  return CacheService.getScriptCache();
}

function sanitizeLoginIdentity(email) {
  return String(email || '').trim().toLowerCase();
}

function getLoginAttemptCacheKey(identity) {
  return 'AUTH_LOGIN_ATTEMPT:' + identity;
}

function getLoginBlockCacheKey(identity) {
  return 'AUTH_LOGIN_BLOCK:' + identity;
}

function parseIntSafe(value, fallback) {
  var parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

function assertLoginAllowed(identity) {
  var cache = getAuthCache();
  var blockedUntilRaw = cache.get(getLoginBlockCacheKey(identity));

  if (!blockedUntilRaw) return;

  var blockedUntil = parseIntSafe(blockedUntilRaw, 0);
  var nowMs = Date.now();
  if (blockedUntil > nowMs) {
    var waitMs = blockedUntil - nowMs;
    var waitMinutes = Math.max(1, Math.ceil(waitMs / 60000));
    throw new Error('Terlalu banyak percobaan login. Coba lagi dalam ' + waitMinutes + ' menit.');
  }

  cache.remove(getLoginBlockCacheKey(identity));
}

function registerFailedLoginAttempt(identity) {
  var cache = getAuthCache();
  var attemptKey = getLoginAttemptCacheKey(identity);
  var currentAttempts = parseIntSafe(cache.get(attemptKey), 0) + 1;

  if (currentAttempts >= CONFIG.LOGIN_MAX_FAILED_ATTEMPTS) {
    var blockedUntil = Date.now() + CONFIG.LOGIN_LOCKOUT_MINUTES * 60000;
    cache.put(getLoginBlockCacheKey(identity), String(blockedUntil), CONFIG.LOGIN_LOCKOUT_MINUTES * 60);
    cache.remove(attemptKey);
    throw new Error('Terlalu banyak percobaan login. Akun dikunci sementara.');
  }

  cache.put(attemptKey, String(currentAttempts), CONFIG.LOGIN_ATTEMPT_WINDOW_MINUTES * 60);
}

function clearLoginAttemptState(identity) {
  var cache = getAuthCache();
  cache.remove(getLoginAttemptCacheKey(identity));
  cache.remove(getLoginBlockCacheKey(identity));
}

function loginHandler(payload) {
  requireFields(payload, ['email', 'password']);

  var identity = sanitizeLoginIdentity(payload.email);
  assertLoginAllowed(identity);

  var users = readRows('users');
  var user = users.filter(function(u) {
    return String(u.email).toLowerCase() === identity && boolValue(u.is_active, true);
  })[0];

  var storedPassword = user ? (user.password || 'simon123') : '';
  if (!user || storedPassword !== payload.password) {
    registerFailedLoginAttempt(identity);
    throw new Error('Invalid credentials');
  }

  clearLoginAttemptState(identity);

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
