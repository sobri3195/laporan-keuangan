function createNotification(userId, title, message) {
  appendRow('notifications', [uuid(), userId, title, message, false, nowIso()]);
}

function listNotifications() { return readRows('notifications'); }
