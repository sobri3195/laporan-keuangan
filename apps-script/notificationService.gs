function createNotification(userId, title, message) {
  return appendObject('notifications', {
    id: uuid(),
    user_id: userId || '',
    title: title || '',
    message: message || '',
    is_read: false,
    created_at: nowIso(),
    read_at: ''
  });
}

function listNotifications() { return readRows('notifications'); }
